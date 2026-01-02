import { createMiddleware } from "hono/factory";
import { decryptJWTToken } from "../util/jwt";
export const validateJWT = createMiddleware(async (ctx, next) => {
	const bearerToken = ctx.req.header("Authorization");
	console.log(bearerToken);
	if (!bearerToken) {
		return ctx.json(
			{
				success: false,
				message: "Unauthorized User",
			},
			401,
		);
	}
	const { success, payload } = await decryptJWTToken(bearerToken);
	if (!success) {
		return ctx.json(
			{
				success: false,
				message: "Unauthorized User",
			},
			401,
		);
	}
	ctx.set("jwtToken", payload);
	await next();
});
