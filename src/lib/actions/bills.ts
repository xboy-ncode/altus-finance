'use server'

import { db } from '@/db'
import { bills } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user
}

export async function addBill(data: {
  name: string
  amount: number
  dueDate: string
  iconType?: string
}) {
  try {
    const user = await getUser()
    
    const [newBill] = await db.insert(bills).values({
      userId: user.id,
      name: data.name,
      amount: data.amount.toString(),
      dueDate: new Date(data.dueDate),
      iconType: data.iconType || 'file',
      color: 'bg-primary/10 text-primary',
      isPaid: false,
    }).returning()
    
    revalidatePath('/dashboard')
    return { success: true, bill: newBill }
  } catch (error: any) {
    console.error('Error adding bill:', error)
    return { success: false, error: error.message || 'Error al agregar el pago.' }
  }
}

export async function markBillAsPaid(id: string, isPaid: boolean) {
  try {
    const user = await getUser()
    
    await db.update(bills)
      .set({ isPaid })
      .where(and(eq(bills.id, id), eq(bills.userId, user.id)))
      
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating bill:', error)
    return { success: false, error: error.message || 'Error al actualizar el pago.' }
  }
}

export async function deleteBill(id: string) {
  try {
    const user = await getUser()
    
    await db.delete(bills)
      .where(and(eq(bills.id, id), eq(bills.userId, user.id)))
      
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting bill:', error)
    return { success: false, error: error.message || 'Error al eliminar el pago.' }
  }
}
