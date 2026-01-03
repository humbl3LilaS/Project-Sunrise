import { createMiddleware } from "hono/factory";
import { decryptJWTToken } from "../util/jwt";
import type { VTJwtPayload } from "../validators/sso.validators";

export const validateJWT = createMiddleware<{
	Variables: {
		jwtToken: VTJwtPayload;
	};
}>(async (ctx, next) => {
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
