'use server'

import { db } from '@/db'
import { accounts, categories } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq, and } from 'drizzle-orm'

export async function getUserAccounts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  return await db.query.accounts.findMany({
    where: eq(accounts.userId, user.id),
  })
}

export async function getUserCategories(type?: 'income' | 'expense') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const conditions = [eq(categories.userId, user.id)]
  if (type) {
    conditions.push(eq(categories.type, type))
  }

  return await db.query.categories.findMany({
    where: and(...conditions),
  })
}
