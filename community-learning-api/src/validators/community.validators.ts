import { createInsertSchema } from "drizzle-zod";
import { communityDetail } from "../db/schema";
import z from "zod";

export const communityDetailInsertSchema = createInsertSchema(
	communityDetail,
).omit({ id: true });

export type VTCommunityDetail = z.infer<typeof communityDetailInsertSchema>;
