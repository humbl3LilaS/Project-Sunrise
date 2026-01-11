import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { communityDetail } from "../db/schema";

export const CommunityDetailSelectSchema = createSelectSchema(communityDetail);

export const communityDetailInsertSchema = createInsertSchema(
	communityDetail,
).omit({ id: true });

export type VTCommunityDetail = z.infer<typeof communityDetailInsertSchema>;

export const banUserPayloadSchema = z.object({
	communityId: z.string().min(1, { message: "Community ID is required" }),
	userId: z.string().min(1, { message: "User ID is required" }),
});

export type VTBanUserPayload = z.infer<typeof banUserPayloadSchema>;
