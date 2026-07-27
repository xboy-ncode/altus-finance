import { pgTable, text, uuid, timestamp, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core'
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
