import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBinding } from "@/types/app.types";
import { cPinoLogger } from "./pino-logger";
import { HttpStatus } from "@/types/util";

export const createRouter = () => {
  return new OpenAPIHono<AppBinding>({ defaultHook: (result, c) => {
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
