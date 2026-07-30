import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { sharedGoals, sharedGoalContributions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userGoals = await db.select({
      id: sharedGoals.id,
      name: sharedGoals.title,
      target: sharedGoals.targetAmount,
      type: sharedGoals.type,
      createdAt: sharedGoals.createdAt,
    })
    .from(sharedGoals)
    .where(eq(sharedGoals.creatorId, user.id))
    .orderBy(desc(sharedGoals.createdAt));

    // Get contributions to calculate "current"
    const allContributions = await db.select().from(sharedGoalContributions)
      .where(eq(sharedGoalContributions.userId, user.id));

    const formattedGoals = userGoals.map(goal => {
      const goalContribs = allContributions.filter(c => c.goalId === goal.id);
      const current = goalContribs.reduce((sum, c) => sum + parseFloat(c.amount), 0);
      
      return {
        id: goal.id,
        name: goal.name,
        target: parseFloat(goal.target),
        current: current,
        type: goal.type,
      };
    });

    return NextResponse.json(formattedGoals);
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlists' }, { status: 500 });
  }
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, target, current, type } = await request.json();

    const [newGoal] = await db.insert(sharedGoals).values({
      creatorId: user.id,
      title: name,
      targetAmount: target,
      type: type || 'custom',
      isPublic: false,
      inviteCode: Math.random().toString(36).substring(2, 10), // Random invite code for internal usage
    }).returning();

    // If an initial 'current' amount is provided, add it as a contribution
    if (current && parseFloat(current) > 0) {
      await db.insert(sharedGoalContributions).values({
        goalId: newGoal.id,
        userId: user.id,
        amount: current,
        note: 'Initial contribution',
      });
    }

    return NextResponse.json({ 
      id: newGoal.id, 
      name: newGoal.title, 
      target: parseFloat(newGoal.targetAmount), 
      current: current ? parseFloat(current) : 0, 
      type: newGoal.type 
    });
  } catch (error) {
    console.error('Error creating wishlist:', error);
    return NextResponse.json({ error: 'Failed to create wishlist' }, { status: 500 });
  }
}
