import { createRoute, z } from "@hono/zod-openapi";
import { createSuccessResponse, failedResponse } from "@utils/open-api";

const tags = ["SSO"];

export const signIn = createRoute({
  path: "/sso/sign-in",
  method: "post",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: createSuccessResponse(z.object({ token: z.string() })),
        },

      },
      description: "Success Response",
    },
    401: {
      content: {
        "application/json": {
          schema: failedResponse,
        },
      },
      description: "Failed Response Due to Invalid Email or password",
    },
    500: {
      content: {
        "application/json": {
          schema: failedResponse,
        },
      },
      description: "Unhandled Response From Server",
    },

  },
});

export type SignInRoute = typeof signIn;
