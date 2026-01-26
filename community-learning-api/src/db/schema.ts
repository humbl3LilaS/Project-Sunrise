import {
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { CommunityType, CommunityUserRole, UserRole } from './enum'

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  role: UserRole('user_role').default('STUDENT').notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
})

export const DBUserSchema = createSelectSchema(users)
export type TUsers = typeof users.$inferSelect

// TODO: Update the communityDetail schema to include createdAt timestmap and updatedAt timestamp.
export const communityDetail = pgTable('community_detail', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  description: text().notNull(),
  type: CommunityType('type').default('PUBLIC'),
  bgUrl: text(),
})

export const DBCommunityDetailSchema = createSelectSchema(communityDetail)
export type TCommnityDetail = typeof communityDetail.$inferSelect

export const communityUsers = pgTable(
  'community_users',
  {
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    communityId: uuid('community_id').references(() => communityDetail.id, {
      onDelete: 'cascade',
    }),
    userRole: CommunityUserRole('user_role').default('MEMBER'),
  },
  table => [primaryKey({ columns: [table.userId, table.communityId] })],
)

export type TCommunityUsers = typeof communityUsers.$inferSelect

/**
 * This table stores the users who are banned from certain community.
 */
export const communityBanList = pgTable(
  'community_banlist',
  {
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    communityId: uuid('community_id').references(() => communityDetail.id, {
      onDelete: 'cascade',
    }),
  },
  table => [primaryKey({ columns: [table.userId, table.communityId] })],
)

export type TCommunityBanList = typeof communityBanList.$inferInsert
