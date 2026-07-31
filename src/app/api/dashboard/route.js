import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { accounts, transactions, categories } from '@/db/schema'
import { eq, and, gte, lte, sum, count, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'this-month'

  const now = new Date()
  let startDate, endDate

  if (period === 'this-year') {
    startDate = new Date(now.getFullYear(), 0, 1)
    endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  }

  // --- Helper to fetch rates ---
  let bcvRate = null;
  let binanceRate = null;
  try {
    const bcvRes = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-store' });
    if (bcvRes.ok) bcvRate = (await bcvRes.json()).promedio;
  } catch (e) {}
  try {
    const binanceRes = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fiat: 'VES', page: 1, rows: 10, tradeType: 'BUY', asset: 'USDT', countries: [], proMerchantAds: false, shieldMerchantAds: false, publisherType: null, payTypes: [] }),
      cache: 'no-store'
    });
    if (binanceRes.ok) {
      const ads = (await binanceRes.json()).data;
      if (ads && ads.length > 0) {
        const prices = ads.map(a => parseFloat(a.adv.price));
        binanceRate = prices.reduce((a, b) => a + b, 0) / prices.length;
      }
    }
  } catch(e) {}

  try {
    // 1. Total balance across all accounts
    const userAccounts = await db.select().from(accounts).where(eq(accounts.userId, user.id))
    
    let totalBalanceUSDT = 0;
    let totalBs = 0;
    let totalUSD = 0;

    userAccounts.forEach(acc => {
      const bal = parseFloat(acc.balance || 0);
      if (acc.currency === 'VES') {
        totalBs += bal;
        totalBalanceUSDT += (binanceRate ? bal / binanceRate : 0);
      } else {
        totalUSD += bal;
        totalBalanceUSDT += bal;
      }
    });

    const totalBalanceBCV = totalUSD + (bcvRate ? totalBs / bcvRate : 0);
    // Helper to get normalized amount
    const getNormalizedAmount = (amount, currency) => {
      const num = parseFloat(amount);
      if (currency === 'VES' && binanceRate) return num / binanceRate;
      return num;
    };

    // 2. Transactions in period
    const periodTransactions = await db.select({
      id: transactions.id,
      amount: transactions.amount,
      categoryId: transactions.categoryId,
      categoryType: categories.type,
      currency: accounts.currency,
      merchant: transactions.merchant
    }).from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, user.id),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )

    const isTransfer = (t) => t.categoryType === 'transfer' || (t.merchant && t.merchant.startsWith('Transferencia'));

    const totalIncome = periodTransactions
      .filter(t => !isTransfer(t) && parseFloat(t.amount) > 0)
      .reduce((s, t) => s + getNormalizedAmount(t.amount, t.currency), 0)

    const totalExpenses = periodTransactions
      .filter(t => !isTransfer(t) && parseFloat(t.amount) < 0)
      .reduce((s, t) => s + Math.abs(getNormalizedAmount(t.amount, t.currency)), 0)

    // 3. Recent transactions (last 10)
    const recentTransactions = await db.select().from(transactions)
      .where(eq(transactions.userId, user.id))
      .orderBy(desc(transactions.date))
      .limit(10)

    // 4. Expenses by category
    const userCategories = await db.select().from(categories).where(eq(categories.userId, user.id))
    const expensesByCategory = userCategories.map(cat => {
      const catTotal = periodTransactions
        .filter(t => t.categoryId === cat.id && parseFloat(t.amount) < 0 && !isTransfer(t))
        .reduce((s, t) => s + Math.abs(getNormalizedAmount(t.amount, t.currency)), 0)
      return { name: cat.name, value: catTotal, icon: cat.icon }
    }).filter(c => c.value > 0)

    // 5. Monthly balance for chart (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const last6MonthsTxs = await db.select({
      amount: transactions.amount,
      date: transactions.date,
      categoryType: categories.type,
      currency: accounts.currency,
      merchant: transactions.merchant
    }).from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(eq(transactions.userId, user.id), gte(transactions.date, sixMonthsAgo))
      )

    const monthlyBalance = []
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
      
      const monthTxs = last6MonthsTxs.filter(t => t.date >= mStart && t.date <= mEnd && !isTransfer(t));
      
      const income = monthTxs.filter(t => parseFloat(t.amount) > 0).reduce((s, t) => s + getNormalizedAmount(t.amount, t.currency), 0)
      const expenses = monthTxs.filter(t => parseFloat(t.amount) < 0).reduce((s, t) => s + Math.abs(getNormalizedAmount(t.amount, t.currency)), 0)
      
      monthlyBalance.push({
        month: mStart.toLocaleString('es', { month: 'short' }),
        income,
        expenses,
        balance: income - expenses
      })
    }

    return NextResponse.json({
      overview: {
        totalBalance: totalBalanceUSDT,
        totalBalanceBCV,
        totalBs,
        totalUSD,
        rates: { bcv: bcvRate, binance: binanceRate },
        totalIncome,
        totalExpenses,
        netSavings: totalIncome - totalExpenses,
        accountCount: userAccounts.length,
      },
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        description: t.description,
        amount: parseFloat(t.amount),
        date: t.date,
        categoryId: t.categoryId,
        merchant: t.merchant,
      })),
      expensesByCategory,
      monthlyBalance,
      upcomingBills: [], // TODO: implementar facturas recurrentes
    })
  } catch (error) {
    console.error('Error en /api/dashboard:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
