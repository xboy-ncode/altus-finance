import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { accounts } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userAccounts = await db.select({
      id: accounts.id,
      name: accounts.name,
      type: accounts.type,
      balance: accounts.balance,
      color: accounts.color,
    })
    .from(accounts)
    .where(eq(accounts.userId, user.id))
    .orderBy(desc(accounts.createdAt))

    const formattedAccounts = userAccounts.map(acc => ({
      ...acc,
      balance: parseFloat(acc.balance),
    }))

    return NextResponse.json(formattedAccounts)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
  }
}
