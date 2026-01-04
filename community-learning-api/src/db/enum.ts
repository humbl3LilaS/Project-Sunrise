import { pgEnum } from "drizzle-orm/pg-core";

export const UserRole = pgEnum("user_role", ["ADMIN", "STUDENT", "INSTRUCTOR"]);

export type TUserRole = (typeof UserRole.enumValues)[number];
