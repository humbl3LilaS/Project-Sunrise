import type { ZodObject } from "zod";
import type { AppOpenApi } from "@/types/app.types";
import type { ZodIssue, ZodSchema } from "@/types/util.types";
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

export const createSuccessResponse = <T extends ZodObject | ZodSchema>(schema: T) => {
  return z.object({
    success: z.literal(true),
    data: schema,
  });
};

export const failedResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

export const jsonContent = <
  T extends ZodSchema,
>(schema: T,
  description: string,
) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
};

export const createValidationErrorSchema = <T extends ZodSchema>(schema: T) => {
  const { error } = schema.safeParse(
    schema._def.type === "array" ? [schema.element._def.type === "string" ? 123 : "invalid"] : {},
  );

  const example = error
    ? {
        name: error.name,
        issues: error.issues.map((issue: ZodIssue) => ({
          code: issue.code,
          path: issue.path,
          message: issue.message,
        })),
      }
    : {
        name: "ZodError",
        issues: [
          {
            code: "invalid_type",
            path: ["fieldName"],
            message: "Expected string, received undefined",
          },
        ],
      };

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example,
      }),
  });
};
