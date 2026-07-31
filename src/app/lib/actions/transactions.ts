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
        date: new Date(formData.date + 'T12:00:00Z'),
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

export async function updateTransaction(
  txId: string, 
  oldAmount: number,
  formData: {
    description: string
    amount: number
    date: string
    accountId: string
    categoryId?: string
    merchant?: string
    isRecurring?: boolean
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  try {
    await db.transaction(async (tx) => {
      // 1. Update the transaction
      await tx.update(transactions)
        .set({
          description: formData.description,
          amount: formData.amount.toString(),
          date: new Date(formData.date + 'T12:00:00Z'),
          accountId: formData.accountId,
          categoryId: formData.categoryId,
          merchant: formData.merchant,
          isRecurring: formData.isRecurring ?? false,
        })
        .where(eq(transactions.id, txId))

      // 2. We assume the account remains the same. If the account changes, it's more complex.
      // We will only support changing amount on the same account for now.
      const [account] = await tx.select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(accounts.id, formData.accountId))

      if (account) {
        // Revert old amount and apply new amount
        const currentBalance = parseFloat(account.balance)
        const newBalance = currentBalance - oldAmount + formData.amount
        
        await tx.update(accounts)
          .set({ balance: newBalance.toString() })
          .where(eq(accounts.id, formData.accountId))
      }
    })

    revalidatePath('/transactions')
    revalidatePath('/dashboard')
    revalidatePath('/accounts')

    return { success: true }
  } catch (error) {
    console.error('Error updating transaction:', error)
    return { success: false, error: 'Failed to update transaction' }
  }
}

export async function createTransfer(formData: {
  description: string
  fromAmount: number
  toAmount: number
  date: string
  fromAccountId: string
  toAccountId: string
  categoryId?: string
  notes?: string
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
      // 1. Transaction: Expense from source account
      const [outTx] = await tx.insert(transactions).values({
        userId: user.id,
        description: formData.description,
        amount: (-Math.abs(formData.fromAmount)).toString(),
        date: new Date(formData.date + 'T12:00:00Z'),
        accountId: formData.fromAccountId,
        categoryId: formData.categoryId,
        merchant: 'Transferencia Saliente',
      }).returning()

      // 2. Update source account balance
      const [fromAcc] = await tx.select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(accounts.id, formData.fromAccountId))
      if (fromAcc) {
        await tx.update(accounts)
          .set({ balance: (parseFloat(fromAcc.balance) - Math.abs(formData.fromAmount)).toString() })
          .where(eq(accounts.id, formData.fromAccountId))
      }

      // 3. Transaction: Income to destination account
      const [inTx] = await tx.insert(transactions).values({
        userId: user.id,
        description: formData.description,
        amount: Math.abs(formData.toAmount).toString(),
        date: new Date(formData.date + 'T12:00:00Z'),
        accountId: formData.toAccountId,
        categoryId: formData.categoryId,
        merchant: 'Transferencia Entrante',
      }).returning()

      // 4. Update destination account balance
      const [toAcc] = await tx.select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(accounts.id, formData.toAccountId))
      if (toAcc) {
        await tx.update(accounts)
          .set({ balance: (parseFloat(toAcc.balance) + Math.abs(formData.toAmount)).toString() })
          .where(eq(accounts.id, formData.toAccountId))
      }

      return { outTx, inTx }
    })

    revalidatePath('/transactions')
    revalidatePath('/dashboard')
    revalidatePath('/accounts')

    return { success: true, data: result.inTx } // Return one of them to update UI
  } catch (error) {
    console.error('Error creating transfer:', error)
    return { success: false, error: 'Failed to create transfer' }
  }
}

