import type { AppEnv } from "@src/types/util";
import { decryptJWTToken } from "@utils/jwt";
import { createMiddleware } from "hono/factory";

export const validateJWT = createMiddleware<AppEnv>(async (ctx, next) => {
	const authorizationHeader = ctx.req.header("Authorization");
	if (!authorizationHeader) {
		return ctx.json(
			{
				success: false,
				message: "Unauthorized Request",
			},
			401,
		);
	}

	const [_, bearerToken] = authorizationHeader.split(" ");

	if (!bearerToken) {
		return ctx.json(
			{
				success: false,
				message: "Unauthorized Request",
			},
			401,
		);
	}

	const decryptedToken = await decryptJWTToken(bearerToken);

	if (!decryptedToken.success) {
		return ctx.json(
			{
				success: false,
				message: `${decryptedToken.message}`,
			},
			401,
		);
	}
	ctx.set("jwtToken", decryptedToken.payload);
	await next();
});
