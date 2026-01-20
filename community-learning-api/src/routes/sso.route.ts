import {
	getUserData,
	registerUser,
	updateUserData,
	verifyUser,
} from "@actions/sso.actions";
import { OpenAPIHono } from "@hono/zod-openapi";
import { validateJWT } from "@middlewares/index";
import {
	docSsoGetMe,
	docSsoRegister,
	docSsoSignIn,
	docSsoUpdateMe,
} from "@src/docs/sso.docs";
import { type AppEnv, HttpStatus } from "@src/types/util";

export const sso = new OpenAPIHono<AppEnv>();

sso.use("/me", validateJWT);

sso.openapi(docSsoRegister, async (ctx) => {
	const data = ctx.req.valid("json");
	const res = await registerUser(data);
	if (res.status !== HttpStatus.Created) {
		return ctx.json({ success: false, message: res.message }, res.status);
	}
	return ctx.json({ success: true, data: { token: res.data } }, res.status);
});

sso.openapi(docSsoSignIn, async (ctx) => {
	const payload = ctx.req.valid("json");
	const res = await verifyUser(payload);
	if (res.status !== HttpStatus.OK) {
		return ctx.json({ success: false, message: res.message }, res.status);
	}
	return ctx.json({ success: true, data: { token: res.data } }, res.status);
});

sso.openapi(docSsoGetMe, async (ctx) => {
	const { userid } = ctx.var.jwtToken;
	const res = await getUserData(userid);
	if (res.status !== HttpStatus.OK) {
		return ctx.json({ success: false, message: res.message }, res.status);
	}
	return ctx.json(
		{
			success: true,
			data: {
				id: res.data.id,
				email: res.data.email,
				age: res.data.age,
				name: res.data.name,
			},
		},
		res.status,
	);
});

sso.openapi(docSsoUpdateMe, async (ctx) => {
	const { userid } = ctx.var.jwtToken;
	const payload = ctx.req.valid("json");
	const res = await updateUserData(userid, payload);
	if (res.status !== HttpStatus.OK) {
		return ctx.json({ success: false, message: res.message }, res.status);
	}
	return ctx.json(
		{
			success: true,
			data: {
				id: res.data.id,
				email: res.data.email,
				age: res.data.age,
				name: res.data.name,
			},
		},
		res.status,
	);
});
