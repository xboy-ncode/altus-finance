'use server'

import { db } from '@/db'
import { profiles, accounts, categories } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'

export async function setupNewUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No user found' }
  }

  try {
    // 1. Check if profile already exists to avoid duplication
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    })

    if (existingProfile) {
      return { success: true, message: 'User already setup' }
    }

    // 2. Create Profile
    await db.insert(profiles).values({
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || user.user_metadata?.name || 'Nuevo Usuario',
      avatarUrl: user.user_metadata?.avatar_url || null,
      avatarType: 'url',
      currency: 'USD',
    })

    // 3. Create Default Accounts
    const defaultAccounts = [
      { userId: user.id, name: 'Efectivo', type: 'cash' as const, balance: '0', color: '#10b981' },
      { userId: user.id, name: 'Cuenta Bancaria', type: 'bank' as const, balance: '0', color: '#3b82f6' },
    ]
    
    await db.insert(accounts).values(defaultAccounts)

    // 4. Create Default Categories
    const defaultCategories = [
      { userId: user.id, name: 'Alimentación', type: 'expense' as const, icon: 'Coffee' },
      { userId: user.id, name: 'Transporte', type: 'expense' as const, icon: 'Car' },
      { userId: user.id, name: 'Vivienda', type: 'expense' as const, icon: 'Home' },
      { userId: user.id, name: 'Salud', type: 'expense' as const, icon: 'Pill' },
      { userId: user.id, name: 'Entretenimiento', type: 'expense' as const, icon: 'LayoutGrid' },
      { userId: user.id, name: 'Salario', type: 'income' as const, icon: 'DollarSign' },
      { userId: user.id, name: 'Otros', type: 'expense' as const, icon: 'LayoutGrid' },
    ]

    await db.insert(categories).values(defaultCategories)

    return { success: true }
  } catch (error) {
    console.error('Error in setupNewUser:', error)
    return { success: false, error: 'Failed to initialize user data' }
  }
}
