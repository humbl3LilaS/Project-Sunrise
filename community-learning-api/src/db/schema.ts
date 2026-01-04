import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { UserRole } from "./enum";

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	role: UserRole("user_role").default("STUDENT").notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
});

export type TUsers = typeof users.$inferSelect;
