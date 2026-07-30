import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { transactions, categories, accounts } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userTransactions = await db.select({
      id: transactions.id,
      description: transactions.description,
      amount: transactions.amount,
      date: transactions.date,
      merchant: transactions.merchant,
      type: categories.type,
      categoryName: categories.name,
      accountName: accounts.name,
      accountId: transactions.accountId,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .leftJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(eq(transactions.userId, user.id))
    .orderBy(desc(transactions.date))

    const formattedTxs = userTransactions.map(tx => {
      let resolvedType = 'Gasto';
      if (tx.merchant?.startsWith('Transferencia')) {
        resolvedType = 'Transferencia';
      } else if (parseFloat(tx.amount) > 0) {
        resolvedType = 'Ingreso';
      } else if (tx.type === 'income') {
        resolvedType = 'Ingreso';
      }

      return {
        id: tx.id,
        description: tx.description,
        amount: parseFloat(tx.amount),
        date: tx.date,
        merchant: tx.merchant,
        type: resolvedType,
        category: tx.categoryName || 'General',
        account: tx.accountName || 'Cuenta',
        accountId: tx.accountId,
      };
    });

    return NextResponse.json(formattedTxs)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
