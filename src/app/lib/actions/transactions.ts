'use server'

import { db } from '@/db'
import { transactions } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTransaction(formData: {
  description: string
  amount: number
  date: string
  accountId: string
  categoryId?: string
  merchant?: string
  isRecurring?: boolean
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  try {
    const result = await db.insert(transactions).values({
      userId: user.id,
      description: formData.description,
      amount: formData.amount.toString(), // Drizzle decimal expects string or number, but schema says decimal
      date: new Date(formData.date),
      accountId: formData.accountId,
      categoryId: formData.categoryId,
      merchant: formData.merchant,
      isRecurring: formData.isRecurring ?? false,
    }).returning()

    revalidatePath('/transactions')
    revalidatePath('/dashboard')

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { success: false, error: 'Failed to create transaction' }
  }
}
