import type { AppBindings } from "@/types/app.types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { HttpStatus } from "@/types/util.types";
import { cPinoLogger } from "./pino-logger";

export const createRouter = () => {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: result.success,
          error: {
            name: result.error.name,
            issues: result.error.issues,
          },
        },
        422,
      );
    }
  } });
};

const createApp = () => {
  const app = createRouter();
  app.use(cPinoLogger());

  app.notFound((ctx) => {
    return ctx.json({ success: false, message: `Endpoint ${ctx.req.path} not supported` }, HttpStatus.NotFound);
  });

  app.onError((_err, ctx) => {
    return ctx.json({ success: false, message: "Global error handler." });
  });

  return app;
};

export default createApp;
