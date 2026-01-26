import { cz } from "@utils/open-api-zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { communityDetail } from "../db/schema";

export const communityDetailSelectSchema = createSelectSchema(communityDetail, {
  id: schema =>
    schema.openapi({ example: "6eb791c8-849e-453d-bf66-1d907a4485fa" }),
});

export const communityDetailInsertSchema = createInsertSchema(
  communityDetail,
).omit({ id: true });

export type VTCommunityDetail = cz.infer<typeof communityDetailInsertSchema>;

export const banUserPayloadSchema = cz.object({
  communityId: cz.string().min(1, { message: "Community ID is required" }),
  userId: cz.string().min(1, { message: "User ID is required" }),
});

export type VTBanUserPayload = cz.infer<typeof banUserPayloadSchema>;
