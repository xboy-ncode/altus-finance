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

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { name, type, balance } = body

    const [newAccount] = await db.insert(accounts).values({
      userId: user.id,
      name,
      type,
      balance: balance?.toString() || '0',
    }).returning()

    return NextResponse.json(newAccount)
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}

export async function PUT(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { id, name, type, balance } = body
    
    if (!id) return NextResponse.json({ error: 'Missing account ID' }, { status: 400 })

    const [updatedAccount] = await db.update(accounts)
      .set({ name, type, balance: balance?.toString(), updatedAt: new Date() })
      .where(eq(accounts.id, id))
      .returning()

    return NextResponse.json(updatedAccount)
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) return NextResponse.json({ error: 'Missing account ID' }, { status: 400 })

    await db.delete(accounts).where(eq(accounts.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}

