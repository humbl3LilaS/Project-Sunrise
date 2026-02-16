import { DBCommunityDetailSchema } from "@db/schema";
import { createRoute } from "@hono/zod-openapi";
import { createSuccessResponse, createValidationErrorSchema, failedResponse, jsonContent } from "@utils/open-api";
import { HttpStatus } from "@/types/util.types";
import { createNewCommunitySchema } from "./community.validators";

const tags = ["community"];

export const createNewCommunity = createRoute({
  path: "communities/create",
  method: "post",
  tags,
  request: {
    body: jsonContent(createNewCommunitySchema, "Payload to perform Sign In."),
  },
  responses: {
    [HttpStatus.Created]: jsonContent(
      createSuccessResponse(DBCommunityDetailSchema),
      "Success Response",
    ),
    [HttpStatus.UnprocessableEntity]: jsonContent(createValidationErrorSchema(createNewCommunitySchema), "JSON Body Payload Validation Error(s)."),
    [HttpStatus.Unauthorized]: jsonContent(failedResponse, "Failed Response Due to Invalid JWT Token."),
    [HttpStatus.BadRequest]: jsonContent(failedResponse, "Bad Request"),
    [HttpStatus.InternalServerError]: jsonContent(failedResponse, "Unhandled Response From Server"),
  },
});

export type CreateNewCommunityRoute = typeof createNewCommunity;
