import {
	integer,
	pgTable,
	uuid,
	varchar,
	text,
	primaryKey,
	boolean,
} from "drizzle-orm/pg-core";
import { CommunityType, CommunityUserRole, UserRole } from "./enum";

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	role: UserRole("user_role").default("STUDENT").notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
});

export type TUsers = typeof users.$inferSelect;

export const communityDetail = pgTable("community_detail", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	type: CommunityType("type").default("PUBLIC"),
	bgUrl: text(),
});

export type TCommnityDetail = typeof communityDetail.$inferSelect;

export const communityUsers = pgTable(
	"community_users",
	{
		userId: uuid("user_id").references(() => users.id),
		communityId: uuid("community_id").references(() => communityDetail.id),
		userRole: CommunityUserRole("user_role").default("USER"),
		isBanned: boolean("is_banned").default(false),
	},
	(table) => [primaryKey({ columns: [table.userId, table.communityId] })],
);

export type TCommunityUsers = typeof communityUsers.$inferSelect;
