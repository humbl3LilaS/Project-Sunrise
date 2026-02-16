import { DBCommunityDetailSchema } from "@db/schema";
import { createRoute, z } from "@hono/zod-openapi";
import {
  createSuccessResponse,
  failedResponse,
  jsonContent,
} from "@utils/open-api";
import { HttpStatus } from "@/types/util.types";

const tags = ["community"];

export const getAllPublicCommunities = createRoute({
  path: "communities/public",
  method: "get",
  tags,
  responses: {
    [HttpStatus.OK]: jsonContent(
      createSuccessResponse(z.array(DBCommunityDetailSchema)),
      "Success Response",
    ),
    [HttpStatus.NotFound]: jsonContent(
      failedResponse,
      "Public Communities Not Found.",
    ),
    [HttpStatus.InternalServerError]: jsonContent(
      failedResponse,
      "Unhandled Response From Server",
    ),
  },
});

export type GetAllPublicCommunitiesRoute = typeof getAllPublicCommunities;
