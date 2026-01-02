import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { registerUser, verifyUser } from "../actions/sso.actions";
import { signInSchema, signUpSchema } from "../validators/sso";

export const sso = new Hono();

sso.post("/sign-up", zValidator("json", signUpSchema), async (ctx) => {
	const data = ctx.req.valid("json");
	const { success, message, token } = await registerUser(data);
	if (!success) {
		return ctx.json({ success: false, message }, 400);
	}
	return ctx.json(
		{ success: true, message: "User registered Successfully", token },
		200,
	);
});

sso.post("/sign-in", zValidator("json", signInSchema), async (ctx) => {
	const payload = ctx.req.valid("json");
	const { success, message, token } = await verifyUser(payload);
	if (!success) {
		return ctx.json({ success: false, message }, 400);
	}
	return ctx.json({ success: true, token, message }, 200);
});
