import type { z } from "@hono/zod-openapi";

export const HttpStatus = {
  OK: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  Forbidden: 403,
  UnprocessableEntity: 422,
  InternalServerError: 500,
  NotImplemented: 501,
} as const;

type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

type SuccessStatus = Extract<HttpStatusCode, 200 | 201 | 204>;
type ErrorStatus = Exclude<HttpStatusCode, SuccessStatus>;
type ActionStatusMap<T> = { [S in SuccessStatus]: { data: T } } & {
  [E in ErrorStatus]: { message: string };
};

export type TActionResponse<
  T,
  S extends keyof ActionStatusMap<T> = keyof ActionStatusMap<T>,
> = Promise<{ [K in S]: { status: K } & ActionStatusMap<T>[K] }[S]>;

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
export type ZodIssue = z.ZodIssue;
