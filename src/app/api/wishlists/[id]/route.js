import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { sharedGoals, sharedGoalContributions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { name, target, current, type } = await request.json();

    // Verify ownership
    const [goal] = await db.select().from(sharedGoals)
      .where(and(eq(sharedGoals.id, id), eq(sharedGoals.creatorId, user.id)));

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Update goal details
    await db.update(sharedGoals).set({
      title: name,
      targetAmount: target,
      type: type,
      updatedAt: new Date(),
    }).where(eq(sharedGoals.id, id));

    // To update 'current', we'll just clear old contributions by this user for this goal 
    // and insert a single consolidated contribution with the new amount.
    if (current !== undefined) {
      await db.delete(sharedGoalContributions)
        .where(and(eq(sharedGoalContributions.goalId, id), eq(sharedGoalContributions.userId, user.id)));
        
      if (parseFloat(current) > 0) {
        await db.insert(sharedGoalContributions).values({
          goalId: id,
          userId: user.id,
          amount: current,
          note: 'Updated contribution',
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Manually delete dependent records to avoid foreign key constraint errors
    await db.delete(sharedGoalContributions).where(eq(sharedGoalContributions.goalId, id));
    
    // Si tienes otras tablas que dependen de sharedGoals, elimínalas aquí:
    try {
      const { sharedGoalMembers, sharedGoalNotes, sharedGoalMedia, travelExpenses } = await import('@/db/schema');
      if (sharedGoalMembers) await db.delete(sharedGoalMembers).where(eq(sharedGoalMembers.goalId, id));
      if (sharedGoalNotes) await db.delete(sharedGoalNotes).where(eq(sharedGoalNotes.goalId, id));
      if (sharedGoalMedia) await db.delete(sharedGoalMedia).where(eq(sharedGoalMedia.goalId, id));
      if (travelExpenses) await db.delete(travelExpenses).where(eq(travelExpenses.goalId, id));
    } catch (e) {
      console.warn("Could not delete some related tables:", e);
    }

    const [deleted] = await db.delete(sharedGoals)
      .where(and(eq(sharedGoals.id, id), eq(sharedGoals.creatorId, user.id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    return NextResponse.json({ error: 'Failed to delete wishlist' }, { status: 500 });
  }
}
