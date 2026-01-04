import { Hono } from "hono";

export const community = new Hono();

community.get("/", async (ctx) => {
	return ctx.json({ success: true });
});
