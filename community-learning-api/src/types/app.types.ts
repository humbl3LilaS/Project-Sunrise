import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { VTJwtPayload } from "@valid/sso.validators";
import type { Schema } from "hono";
import type { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    jwtToken: VTJwtPayload;
    logger: PinoLogger;
  };
}

export type AppOpenApi = OpenAPIHono<AppBindings>;

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
