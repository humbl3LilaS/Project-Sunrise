CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'STUDENT', 'INSTRUCTOR');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_role" "user_role" DEFAULT 'STUDENT';