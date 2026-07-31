'use server'

import { db } from '@/db'
import { travelExpenses, sharedGoalMembers } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return user
}

export async function addTravelExpense(data) {
  try {
    const user = await getUser()

    // Verify user is member of this goal
    const member = await db.query.sharedGoalMembers.findFirst({
      where: and(
        eq(sharedGoalMembers.goalId, data.goalId),
        eq(sharedGoalMembers.userId, user.id)
      )
    })

    if (!member) {
      return { success: false, error: 'No tienes permisos para este viaje.' }
    }

    await db.insert(travelExpenses).values({
      goalId: data.goalId,
      userId: user.id,
      name: data.name,
      amount: data.amount,
      category: data.category || 'Otros',
      color: data.color || '#8884d8',
      priority: Number(data.priority) || 1
    })

    revalidatePath(`/shared-planner/${data.goalId}`)
    return { success: true }
  } catch (error) {
    console.error('Error adding travel expense:', error)
    return { success: false, error: 'Error al registrar el ítem.' }
  }
}

export async function editTravelExpense(id, data) {
  try {
    const user = await getUser()

    // Verify user is member of this goal
    const member = await db.query.sharedGoalMembers.findFirst({
      where: and(
        eq(sharedGoalMembers.goalId, data.goalId),
        eq(sharedGoalMembers.userId, user.id)
      )
    })

    if (!member) {
      return { success: false, error: 'No tienes permisos para esta meta.' }
    }

    await db.update(travelExpenses)
      .set({
        name: data.name,
        amount: data.amount,
        category: data.category || 'Otros',
        color: data.color || '#8884d8',
        priority: Number(data.priority) || 1
      })
      .where(eq(travelExpenses.id, id))

    revalidatePath(`/shared-planner/${data.goalId}`)
    return { success: true }
  } catch (error) {
    console.error('Error editing expense:', error)
    return { success: false, error: 'Error al editar el ítem.' }
  }
}
