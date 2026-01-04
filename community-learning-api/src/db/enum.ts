import { pgEnum } from "drizzle-orm/pg-core";

export const UserRole = pgEnum("user_role", ["ADMIN", "STUDENT", "INSTRUCTOR"]);

export type TUserRole = (typeof UserRole.enumValues)[number];

export const CommunityType = pgEnum("community_type", [
	"PRIVATE",
	"PUBLIC",
	"ARCHIVE",
]);

export type TCommunityType = (typeof CommunityType.enumValues)[number];

export const CommunityUserRole = pgEnum("community_user_role", [
	"ADMIN",
	"MODERATOR",
	"USER",
]);
