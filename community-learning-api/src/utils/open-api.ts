import type { AppOpenApi } from "@/types/app.types";
import { swaggerUI } from "@hono/swagger-ui";
import { z } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import packageJSON from "../../package.json";

export const configureOpenApi = (app: AppOpenApi) => {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Open API Hono Testing",
    },
  });

  app.get("/swagger", swaggerUI({ url: "/doc" }));
  app.get("/scalar", Scalar({ url: "/doc" }));
};

export const createSuccessResponse = <T>(schema: T) => {
  return z.object({
    success: z.literal(true),
    data: schema,
  });
};

export const failedResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});
