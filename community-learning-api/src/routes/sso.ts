import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	getUserData,
	registerUser,
	updateUserData,
	verifyUser,
} from "../actions/sso.actions";
import { validateJWT } from "../middleware";
import {
	signInSchema,
	signUpSchema,
	userInfoUpdateSchema,
} from "../validators/sso.validators";

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

sso.get("/me", validateJWT, async (ctx) => {
	const { userid } = ctx.var.jwtToken;
	const res = await getUserData(userid);
	if (res.status !== 200) {
		return ctx.json({ sucess: false, message: res.message }, res.status);
	}
	return ctx.json(
		{
			sucess: true,
			data: {
				userid: res.data.id,
				email: res.data.email,
				name: res.data.name,
			},
		},
		200,
	);
});

sso.post(
	"/me",
	validateJWT,
	zValidator("json", userInfoUpdateSchema),
	async (ctx) => {
		const { userid } = ctx.var.jwtToken;
		const payload = ctx.req.valid("json");
		const res = await updateUserData(userid, payload);
		if (res.status !== 200) {
			return ctx.json({ sucess: false }, res.status);
		}
		return ctx.json(
			{
				sucess: true,
				data: {
					userid: res.data.id,
					email: res.data.email,
					name: res.data.name,
				},
			},
			200,
		);
	},
);
