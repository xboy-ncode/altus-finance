import { pgTable, text, uuid, timestamp, decimal, boolean, pgEnum, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const accountTypeEnum = pgEnum('account_type', ['cash', 'bank', 'credit', 'investment', 'savings'])
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense', 'transfer'])

// Profiles (Extends Supabase Auth users)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(), // Matches auth.users id
  email: text('email'),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  avatarType: text('avatar_type').default('url').notNull(), // 'url' or 'icon'
  currency: text('currency').default('USD').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Accounts
export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  type: accountTypeEnum('type').default('bank').notNull(),
  balance: decimal('balance', { precision: 12, scale: 2 }).default('0').notNull(),
  currency: text('currency').default('USD').notNull(),
  color: text('color').default('#3b82f6').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Categories
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }), // null for global categories
  name: text('name').notNull(),
  type: transactionTypeEnum('type').notNull(),
  icon: text('icon').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Transactions
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  date: timestamp('date').defaultNow().notNull(),
  merchant: text('merchant'),
  isRecurring: boolean('is_recurring').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Subscriptions (for SaaS Tier Control)
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').notNull(), // 'active', 'canceled', 'past_due', etc.
  priceId: text('price_id'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  accounts: many(accounts),
  transactions: many(transactions),
  categories: many(categories),
}))

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(profiles, { fields: [accounts.userId], references: [profiles.id] }),
  transactions: many(transactions),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(profiles, { fields: [categories.userId], references: [profiles.id] }),
  transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(profiles, { fields: [transactions.userId], references: [profiles.id] }),
  account: one(accounts, { fields: [transactions.accountId], references: [accounts.id] }),
  category: one(categories, { fields: [transactions.categoryId], references: [categories.id] }),
}))

// --- SHARED PLANNER (PoolGoals) ---

export const sharedGoalStatusEnum = pgEnum('shared_goal_status', ['active', 'completed', 'archived', 'cancelled'])
export const sharedGoalTypeEnum = pgEnum('shared_goal_type', ['travel', 'property', 'product', 'event', 'custom'])
export const memberRoleEnum = pgEnum('member_role', ['owner', 'collaborator', 'viewer'])
export const memberStatusEnum = pgEnum('member_status', ['pending', 'active', 'removed'])

export const sharedGoals = pgTable('shared_goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  type: sharedGoalTypeEnum('type').default('custom').notNull(),
  status: sharedGoalStatusEnum('status').default('active').notNull(),
  targetAmount: decimal('target_amount', { precision: 14, scale: 2 }).notNull(),
  currency: text('currency').default('USD').notNull(),
  targetDate: timestamp('target_date'),
  coverImageUrl: text('cover_image_url'),
  inviteCode: text('invite_code').unique().notNull(), // Código único para unirse
  isPublic: boolean('is_public').default(false).notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sharedGoalMembers = pgTable('shared_goal_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  goalId: uuid('goal_id').references(() => sharedGoals.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  role: memberRoleEnum('role').default('collaborator').notNull(),
  status: memberStatusEnum('status').default('pending').notNull(), // Owner acepta
  joinedAt: timestamp('joined_at'),
  invitedAt: timestamp('invited_at').defaultNow().notNull(),
})

export const sharedGoalContributions = pgTable('shared_goal_contributions', {
  id: uuid('id').defaultRandom().primaryKey(),
  goalId: uuid('goal_id').references(() => sharedGoals.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  note: text('note'),
  date: timestamp('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const sharedGoalNotes = pgTable('shared_goal_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  goalId: uuid('goal_id').references(() => sharedGoals.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sharedGoalMedia = pgTable('shared_goal_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  goalId: uuid('goal_id').references(() => sharedGoals.id, { onDelete: 'cascade' }).notNull(),
  uploadedBy: uuid('uploaded_by').references(() => profiles.id, { onDelete: 'set null' }),
  storageUrl: text('storage_url').notNull(),
  caption: text('caption'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const travelExpenses = pgTable('travel_expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  goalId: uuid('goal_id').references(() => sharedGoals.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  category: text('category').default('Other').notNull(), // Transport, Lodging, Food, Activities
  color: text('color').default('#8884d8').notNull(),
  priority: integer('priority').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Shared Planner Relations
export const sharedGoalsRelations = relations(sharedGoals, ({ one, many }) => ({
  creator: one(profiles, { fields: [sharedGoals.creatorId], references: [profiles.id] }),
  members: many(sharedGoalMembers),
  contributions: many(sharedGoalContributions),
  notes: many(sharedGoalNotes),
  media: many(sharedGoalMedia),
  travelExpenses: many(travelExpenses),
}))

export const sharedGoalMembersRelations = relations(sharedGoalMembers, ({ one }) => ({
  goal: one(sharedGoals, { fields: [sharedGoalMembers.goalId], references: [sharedGoals.id] }),
  user: one(profiles, { fields: [sharedGoalMembers.userId], references: [profiles.id] }),
}))

export const sharedGoalContributionsRelations = relations(sharedGoalContributions, ({ one }) => ({
  goal: one(sharedGoals, { fields: [sharedGoalContributions.goalId], references: [sharedGoals.id] }),
  user: one(profiles, { fields: [sharedGoalContributions.userId], references: [profiles.id] }),
}))

export const sharedGoalNotesRelations = relations(sharedGoalNotes, ({ one }) => ({
  goal: one(sharedGoals, { fields: [sharedGoalNotes.goalId], references: [sharedGoals.id] }),
  user: one(profiles, { fields: [sharedGoalNotes.userId], references: [profiles.id] }),
}))

export const sharedGoalMediaRelations = relations(sharedGoalMedia, ({ one }) => ({
  goal: one(sharedGoals, { fields: [sharedGoalMedia.goalId], references: [sharedGoals.id] }),
  uploader: one(profiles, { fields: [sharedGoalMedia.uploadedBy], references: [profiles.id] }),
}))

export const travelExpensesRelations = relations(travelExpenses, ({ one }) => ({
  goal: one(sharedGoals, { fields: [travelExpenses.goalId], references: [sharedGoals.id] }),
  user: one(profiles, { fields: [travelExpenses.userId], references: [profiles.id] }),
}))
