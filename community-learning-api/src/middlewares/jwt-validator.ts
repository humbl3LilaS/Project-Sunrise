import type { AppBindings } from "@/types/app.types";
import { decryptJWTToken } from "@utils/jwt";
import { createMiddleware } from "hono/factory";
import { HttpStatus } from "@/types/util.types";

export const validateJWT = createMiddleware<AppBindings>(async (ctx, next) => {
  const authorizationHeader = ctx.req.header("Authorization");
  if (!authorizationHeader) {
    return ctx.json(
      {
        success: false,
        message: "Unauthorized Request",
      },
      HttpStatus.Unauthorized,
    );
  }

  const [, bearerToken] = authorizationHeader.split(" ");

  if (!bearerToken) {
    return ctx.json(
      {
        success: false,
        message: "Unauthorized Request",
      },
      HttpStatus.Unauthorized,
    );
  }

  const decryptedToken = await decryptJWTToken(bearerToken);

  if (!decryptedToken.success) {
    return ctx.json(
      {
        success: false,
        message: `${decryptedToken.message}`,
      },
      HttpStatus.Unauthorized,
    );
  }
  ctx.set("jwtToken", decryptedToken.payload);
  await next();
});
