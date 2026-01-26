import { createRoute, z } from "@hono/zod-openapi";

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
          schema: z.object({
            success: z.literal(true),
            message: z.string(),
          }),
        },
      },
      description: "Success Response",
    },
  },
});

export type SignInRoute = typeof signIn;
