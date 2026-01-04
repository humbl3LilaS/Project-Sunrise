CREATE TABLE "community_banlist" (
	"user_id" uuid,
	"community_id" uuid,
	CONSTRAINT "community_banlist_user_id_community_id_pk" PRIMARY KEY("user_id","community_id")
);
--> statement-breakpoint
ALTER TABLE "community_banlist" ADD CONSTRAINT "community_banlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_banlist" ADD CONSTRAINT "community_banlist_community_id_community_detail_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community_detail"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_users" DROP COLUMN "is_banned";