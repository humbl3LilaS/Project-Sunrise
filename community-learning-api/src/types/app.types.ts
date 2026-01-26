import type { OpenAPIHono } from "@hono/zod-openapi";
import type { VTJwtPayload } from "@valid/sso.validators";
import type { PinoLogger } from "hono-pino";

export interface AppBinding {
  Variables: {
    jwtToken: VTJwtPayload;
    logger: PinoLogger;
  };
}

export type AppOpenApi = OpenAPIHono<AppBinding>;
