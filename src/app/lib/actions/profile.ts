'use server'

import { db } from '@/db'
import { profiles } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: {
  fullName?: string
  avatarUrl?: string
  avatarType?: 'url' | 'icon'
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  await db.update(profiles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id))

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  
  return { success: true }
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  return await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  })
}
