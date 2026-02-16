import type z from "zod";

import { DBCommunityDetailSchema } from "@db/schema";

export const createNewCommunitySchema = DBCommunityDetailSchema.omit({
  id: true,
}).partial({
  type: true,
  bgUrl: true,
});

export type TCreateNewCommunitySchema = z.infer<typeof createNewCommunitySchema>;
