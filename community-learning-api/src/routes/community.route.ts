import { Hono } from "hono";
import {
	addUserToBanList,
	createNewCommunity,
	getAllPublicCommunity,
	getCommunityById,
} from "../actions/community.actions";
import { validateJWT } from "../middleware/index";
import { czValidator } from "../util/zod-validator";
import {
	banUserPayloadSchema,
	communityDetailInsertSchema,
} from "../validators/community.validators";

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

community.post(
	"/ban-user",
	validateJWT,
	czValidator("json", banUserPayloadSchema),
	async (ctx) => {
		const { userid } = ctx.var.jwtToken;
		const payload = ctx.req.valid("json");
		if (userid === payload.userId) {
			return ctx.json(
				{
					success: false,
					message: "Invalid Request: User cannot perform ban action on itsef",
				},
				401,
			);
		}
		const res = await addUserToBanList(userid, payload);
		if (res.status !== 201) {
			return ctx.json({ success: false, message: res.message });
		}
		return ctx.json({ success: true, data: res.data });
	},
);

community.get("/:id", async (ctx) => {
	const id = ctx.req.param("id");
	const res = await getCommunityById(id);
	if (res.status !== 200) {
		return ctx.json({ success: false, messsage: res.message }, res.status);
	}
	return ctx.json({ success: true, data: res.data }, res.status);
});
