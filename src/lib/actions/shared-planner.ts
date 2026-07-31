'use server'

import { db } from '@/db'
import { sharedGoals, sharedGoalMembers, sharedGoalContributions, accounts, transactions } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { customAlphabet } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8)

async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return user
}

export async function createSharedGoal(data) {
  try {
    const user = await getUser()
    const inviteCode = nanoid()
    
    // Generar un random UUID para el goal para poder usarlo en la tabla pivot
    const [newGoal] = await db.insert(sharedGoals).values({
      creatorId: user.id,
      title: data.title,
      description: data.description,
      type: data.type || 'custom',
      targetAmount: data.targetAmount,
      currency: data.currency || 'USD',
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      inviteCode: inviteCode,
    }).returning()

    // El creador entra automáticamente como active owner
    await db.insert(sharedGoalMembers).values({
      goalId: newGoal.id,
      userId: user.id,
      role: 'owner',
      status: 'active',
      joinedAt: new Date(),
    })

    revalidatePath('/shared-planner')
    return { success: true, goal: newGoal }
  } catch (error) {
    console.error('Error creating shared goal:', error)
    return { success: false, error: 'Error al crear el plan.' }
  }
}

export async function joinSharedGoalByCode(code) {
  try {
    const user = await getUser()
    
    // Buscar la meta
    const goal = await db.query.sharedGoals.findFirst({
      where: eq(sharedGoals.inviteCode, code)
    })
    
    if (!goal) return { success: false, error: 'Código inválido o meta no encontrada.' }

    // Verificar si ya es miembro
    const existingMember = await db.query.sharedGoalMembers.findFirst({
      where: and(
        eq(sharedGoalMembers.goalId, goal.id),
        eq(sharedGoalMembers.userId, user.id)
      )
    })

    if (existingMember) {
      if (existingMember.status === 'pending') return { success: false, error: 'Tu solicitud ya está pendiente.' }
      return { success: false, error: 'Ya eres miembro de este plan.' }
    }

    // Insertar como pendiente
    await db.insert(sharedGoalMembers).values({
      goalId: goal.id,
      userId: user.id,
      role: 'collaborator',
      status: 'pending'
    })

    return { success: true, message: 'Solicitud enviada al creador exitosamente.' }
  } catch (error) {
    console.error('Error joining goal:', error)
    return { success: false, error: 'Error al unirse al plan.' }
  }
}

export async function acceptMember(goalId, userId) {
  try {
    const currentUser = await getUser()
    
    // Verificar que el usuario actual sea owner (por seguridad)
    const ownerCheck = await db.query.sharedGoalMembers.findFirst({
      where: and(
        eq(sharedGoalMembers.goalId, goalId),
        eq(sharedGoalMembers.userId, currentUser.id),
        eq(sharedGoalMembers.role, 'owner')
      )
    })
    
    if (!ownerCheck) return { success: false, error: 'No tienes permiso para aceptar miembros.' }

    await db.update(sharedGoalMembers)
      .set({ status: 'active', joinedAt: new Date() })
      .where(and(
        eq(sharedGoalMembers.goalId, goalId),
        eq(sharedGoalMembers.userId, userId)
      ))

    revalidatePath(`/shared-planner/${goalId}`)
    return { success: true }
  } catch (error) {
    console.error('Error accepting member:', error)
    return { success: false, error: 'Error al aceptar al miembro.' }
  }
}

export async function addContribution(goalId, amount, note = '', accountId, exchangeRate = 1) {
  try {
    const user = await getUser()

    // 1. Registrar el aporte a la meta (en la moneda de la meta, por ej. USDT)
    await db.insert(sharedGoalContributions).values({
      goalId,
      userId: user.id,
      amount,
      note,
    })

    // 2. Si se especificó una cuenta, descontar y registrar el egreso
    if (accountId) {
      const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId))
      
      if (account) {
        // Calcular el monto a descontar según la moneda de la cuenta
        // Si la cuenta es VES, multiplicamos el aporte (USD) por la tasa (exchangeRate)
        const deductedAmount = account.currency === 'VES' 
          ? (Number(amount) * Number(exchangeRate)).toFixed(2)
          : Number(amount).toFixed(2);
          
        const descSuffix = account.currency === 'VES' ? ` (${Number(amount).toFixed(2)} USD a tasa ${Number(exchangeRate).toFixed(2)})` : '';

        // Actualizar balance
        await db.update(accounts)
          .set({
            balance: sql`${accounts.balance} - ${deductedAmount}`
          })
          .where(eq(accounts.id, accountId));

        // Consultar el nombre de la meta para la descripción
        const [goalQuery] = await db.select({ title: sharedGoals.title }).from(sharedGoals).where(eq(sharedGoals.id, goalId))
        const goalName = goalQuery ? goalQuery.title : 'Meta Financiera';

        // Registrar la transacción
        await db.insert(transactions).values({
          userId: user.id,
          accountId: accountId,
          amount: `-${deductedAmount}`,
          description: `Aporte a: ${goalName}${descSuffix}`,
          merchant: note || 'Meta Financiera',
          date: new Date(),
        })
      }
    }

    revalidatePath(`/shared-planner/${goalId}`)
    return { success: true }
  } catch (error) {
    console.error('Error adding contribution:', error)
    return { success: false, error: 'Error al registrar el aporte.' }
  }
}
