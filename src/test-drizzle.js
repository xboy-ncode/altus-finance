import { db } from './db/index.js';
import { sharedGoals, sharedGoalMembers } from './db/schema.js';

async function run() {
  try {
    const [newGoal] = await db.insert(sharedGoals).values({
      creatorId: 'fa3c1208-0f45-4c01-85fd-4c967580629e',
      title: 'Test Drizzle',
      targetAmount: "1000",
      type: 'custom',
      isPublic: false,
      inviteCode: Math.random().toString(36).substring(2, 10),
    }).returning();

    await db.insert(sharedGoalMembers).values({
      goalId: newGoal.id,
      userId: 'fa3c1208-0f45-4c01-85fd-4c967580629e',
      role: 'owner',
      status: 'active',
      joinedAt: new Date()
    });

    console.log('Success:', newGoal.id);
  } catch (error) {
    console.error('Error:', error);
  }
}
run();
