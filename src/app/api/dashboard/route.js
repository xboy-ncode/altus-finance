import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { accounts, transactions, categories } from '@/db/schema'
import { eq, and, gte, lte, sum, count } from 'drizzle-orm'
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

  try {
    // 1. Total balance across all accounts
    const userAccounts = await db.select().from(accounts).where(eq(accounts.userId, user.id))
    const totalBalance = userAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0)

    // 2. Transactions in period
    const periodTransactions = await db.select().from(transactions).where(
      and(
        eq(transactions.userId, user.id),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      )
    )

    const totalIncome = periodTransactions
      .filter(t => parseFloat(t.amount) > 0)
      .reduce((s, t) => s + parseFloat(t.amount), 0)

    const totalExpenses = periodTransactions
      .filter(t => parseFloat(t.amount) < 0)
      .reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0)

    // 3. Recent transactions (last 10)
    const recentTransactions = await db.select().from(transactions)
      .where(eq(transactions.userId, user.id))
      .orderBy(transactions.date)
      .limit(10)

    // 4. Expenses by category
    const userCategories = await db.select().from(categories).where(eq(categories.userId, user.id))
    const expensesByCategory = userCategories.map(cat => {
      const catTotal = periodTransactions
        .filter(t => t.categoryId === cat.id && parseFloat(t.amount) < 0)
        .reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0)
      return { name: cat.name, value: catTotal, icon: cat.icon }
    }).filter(c => c.value > 0)

    // 5. Monthly balance for chart (last 6 months)
    const monthlyBalance = []
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
      const monthTxs = await db.select().from(transactions).where(
        and(eq(transactions.userId, user.id), gte(transactions.date, mStart), lte(transactions.date, mEnd))
      )
      const income = monthTxs.filter(t => parseFloat(t.amount) > 0).reduce((s, t) => s + parseFloat(t.amount), 0)
      const expenses = monthTxs.filter(t => parseFloat(t.amount) < 0).reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0)
      monthlyBalance.push({
        month: mStart.toLocaleString('es', { month: 'short' }),
        income,
        expenses,
        balance: income - expenses
      })
    }

    return NextResponse.json({
      overview: {
        totalBalance,
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
