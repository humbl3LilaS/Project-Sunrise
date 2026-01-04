CREATE TYPE "public"."community_type" AS ENUM('PRIVATE', 'PUBLIC', 'ARCHIVE');--> statement-breakpoint
CREATE TYPE "public"."community_user_role" AS ENUM('ADMIN', 'MODERATOR', 'USER');--> statement-breakpoint
CREATE TABLE "community_detail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"type" "community_type" DEFAULT 'PUBLIC',
	"bgUrl" text
);
--> statement-breakpoint
CREATE TABLE "community_users" (
	"user_id" uuid,
	"community_id" uuid,
	"user_role" "community_user_role" DEFAULT 'USER',
	"is_banned" boolean DEFAULT false,
	CONSTRAINT "community_users_user_id_community_id_pk" PRIMARY KEY("user_id","community_id")
);
--> statement-breakpoint
ALTER TABLE "community_users" ADD CONSTRAINT "community_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_users" ADD CONSTRAINT "community_users_community_id_community_detail_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community_detail"("id") ON DELETE no action ON UPDATE no action;