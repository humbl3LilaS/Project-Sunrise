import { Hono } from "hono";
import { validateJWT } from "../middleware";
import { czValidator } from "../util/zod-validator";
import { communityDetailInsertSchema } from "../validators/community.validators";
import {
	createNewCommunity,
	getAllPublicCommunity,
} from "../actions/community.actions";

export const community = new Hono();

community.get("/", validateJWT, async (ctx) => {
	const { userid } = ctx.var.jwtToken;
	const res = await getAllPublicCommunity(userid);
	if (res.status !== 200) {
		return ctx.json({ success: false, message: res.message });
	}
	return ctx.json({ success: true, data: res.data });
});

community.post(
	"/create",
	validateJWT,
	czValidator("json", communityDetailInsertSchema),
	async (ctx) => {
		const { userid } = ctx.var.jwtToken;
		const payload = ctx.req.valid("json");
		const res = await createNewCommunity(userid, payload);
		if (res.status !== 201) {
			return ctx.json(
				{
					success: false,
					message: res.message,
				},
				res.status,
			);
		}
		return ctx.json({ success: true, data: res.data }, res.status);
	},
);
