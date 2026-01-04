ALTER TABLE "community_users" DROP CONSTRAINT "community_users_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "community_users" DROP CONSTRAINT "community_users_community_id_community_detail_id_fk";
--> statement-breakpoint
ALTER TABLE "community_users" ADD CONSTRAINT "community_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_users" ADD CONSTRAINT "community_users_community_id_community_detail_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community_detail"("id") ON DELETE cascade ON UPDATE no action;