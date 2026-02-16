import type { TCommunityDetail } from "@db/schema";
import type { TCreateNewCommunitySchema } from "./community.validators";
import type { TActionResponse } from "@/types/util.types";
import { db } from "@db/drizzle";
import { communityDetail, communityUsers } from "@db/schema";
import { CTransactionError } from "@utils/custom-errors";
import { DrizzleQueryError } from "drizzle-orm";

export const createNewCommunity = async (payload: TCreateNewCommunitySchema, userId: string): TActionResponse<TCommunityDetail, 201 | 400 | 500> => {
  try {
    const data = await db.transaction(async (tx) => {
      const [detailData] = await tx.insert(communityDetail).values(
        {
          ...payload,
          type: payload.type ?? "PUBLIC",
        },
      ).returning();

      if (!detailData) {
        throw new CTransactionError("Error Createing new Community.");
      }

      await tx.insert(communityUsers).values({
        communityId: detailData.id,
        userId,
        userRole: "ADMIN",
      });

      return detailData;
    });

    return {
      status: 201,
      data,
    };
  }
  catch (error) {
    if (error instanceof DrizzleQueryError) {
      if (error.cause && "code" in error.cause && error.cause.code === "23505") {
        return {
          status: 400,
          message: `Bad Request: Community with name "${payload.name}" already exist.`,
        };
      }
    }

    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
