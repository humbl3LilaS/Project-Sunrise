import { createRoute, z } from "@hono/zod-openapi";
import { createSuccessResponse, createValidationErrorSchema, failedResponse, jsonContent } from "@utils/open-api";
import { HttpStatus } from "@/types/util.types";
import { signInSchema, signUpSchema } from "./sso.validators";

const tags = ["SSO"];

export const signIn = createRoute({
  path: "/sso/sign-in",
  method: "post",
  tags,
  request: {
    body: jsonContent(signInSchema, "Payload to perform Sign In."),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(createSuccessResponse(z.object({ token: z.string() })), "Success Response"),
    [HttpStatus.UnprocessableEntity]: jsonContent(createValidationErrorSchema(signInSchema), "JSON Body Payload Validation Error(s)."),
    [HttpStatus.BadRequest]: jsonContent(failedResponse, "Failed Response Due to Invalid Email or Password."),
    [HttpStatus.InternalServerError]: jsonContent(failedResponse, "Unhandled Response From Server"),
  },
});

export type SignInRoute = typeof signIn;

export const signUp = createRoute({
  path: "/sso/sign-up",
  method: "post",
  tags,
  request: {
    body: jsonContent(signUpSchema, "Payload to Sign-in as new user."),
  },
  responses: {
    [HttpStatus.Created]: jsonContent(createSuccessResponse(z.object({ token: z.string() })), "Success Response."),
    [HttpStatus.UnprocessableEntity]: jsonContent(createValidationErrorSchema(signUpSchema), "JSON Body Payload Validation Error(s)."),
    [HttpStatus.BadRequest]: jsonContent(failedResponse, "Failed Response Due to Invalid Email or password."),
    [HttpStatus.InternalServerError]: jsonContent(failedResponse, "Unhandled Response From Server"),
  },
});

export type SignUpRoute = typeof signUp;
