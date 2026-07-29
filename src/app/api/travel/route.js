import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { sharedGoals, travelExpenses, sharedGoalMembers } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Fetch user's travel goals
    const memberships = await db.query.sharedGoalMembers.findMany({
      where: and(
        eq(sharedGoalMembers.userId, user.id),
        eq(sharedGoalMembers.status, 'active')
      ),
      with: {
        goal: {
          with: {
            travelExpenses: true
          }
        }
      }
    })

    const trips = memberships
      .map(m => m.goal)
      .filter(g => g.type === 'travel')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // 2. Format to match TRIPS_MOCK structure for frontend
    const formattedTrips = trips.map(trip => {
      const expenses = trip.travelExpenses || [];
      const spent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
      const isPast = trip.targetDate && new Date(trip.targetDate) < new Date();
      
      return {
        id: trip.id,
        destination: trip.title, // En el diseño actual, el título se usa como destino
        dateStr: trip.targetDate ? new Date(trip.targetDate).toLocaleDateString() : 'Sin fecha',
        status: isPast ? 'past' : 'upcoming',
        budget: Number(trip.targetAmount),
        spent: spent,
        expenses: expenses.map(e => ({
          id: e.id,
          name: e.name,
          amount: Number(e.amount),
          category: e.category,
          color: e.color
        }))
      }
    });

    return NextResponse.json(formattedTrips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 })
  }
}
