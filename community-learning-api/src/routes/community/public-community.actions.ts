import type { TCommnityDetail } from "@db/schema";
import type { TActionResponse } from "@/types/util.types";
import { db } from "@db/drizzle";
import { communityDetail } from "@db/schema";
import { eq } from "drizzle-orm";

export const getAllPublicCommunities = async (): TActionResponse<TCommnityDetail[], 200 | 404 | 500> => {
  try {
    const communities = await db.select().from(communityDetail).where(eq(
      communityDetail.type,
      "PUBLIC",
    ));

    if (!communities) {
      return {
        status: 404,
        message: "Not Found",
      };
    }

    return {
      status: 200,
      data: communities,
    };
  }
  catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
