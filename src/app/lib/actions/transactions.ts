'use server'

import { db } from '@/db'
import { transactions, accounts } from '@/db/schema'
import { eq } from 'drizzle-orm'
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
    const result = await db.transaction(async (tx) => {
      // 1. Insert transaction
      const [newTx] = await tx.insert(transactions).values({
        userId: user.id,
        description: formData.description,
        amount: formData.amount.toString(),
        date: new Date(formData.date),
        accountId: formData.accountId,
        categoryId: formData.categoryId,
        merchant: formData.merchant,
        isRecurring: formData.isRecurring ?? false,
      }).returning()

      // 2. Fetch current account balance
      const [account] = await tx.select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(accounts.id, formData.accountId))

      if (account) {
        // 3. Update account balance
        const currentBalance = parseFloat(account.balance)
        const newBalance = currentBalance + formData.amount
        
        await tx.update(accounts)
          .set({ balance: newBalance.toString() })
          .where(eq(accounts.id, formData.accountId))
      }

      return newTx
    })

    revalidatePath('/transactions')
    revalidatePath('/dashboard')
    revalidatePath('/accounts')

    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { success: false, error: 'Failed to create transaction' }
  }
}

export async function deleteTransaction(txId: string, accountId: string, amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  try {
    await db.transaction(async (tx) => {
      await tx.delete(transactions)
        .where(eq(transactions.id, txId))

      const [account] = await tx.select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(accounts.id, accountId))

      if (account) {
        const currentBalance = parseFloat(account.balance)
        const newBalance = currentBalance - amount
        
        await tx.update(accounts)
          .set({ balance: newBalance.toString() })
          .where(eq(accounts.id, accountId))
      }
    })

    revalidatePath('/transactions')
    revalidatePath('/dashboard')
    revalidatePath('/accounts')

    return { success: true }
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return { success: false, error: 'Failed to delete transaction' }
  }
}
