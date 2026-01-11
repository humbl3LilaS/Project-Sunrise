import { cors } from "hono/cors";
import { community } from "./routes/community.route";
import { sso } from "./routes/sso.route";
import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

extendZodWithOpenApi(z);

const app = new OpenAPIHono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Community Learing API",
	},
});

app.get("/swagger", swaggerUI({ url: "/doc" }));

app.use(
	"/api/v0/*",
	cors({
		origin: "http://localhost:3001",
		allowMethods: ["POST", "PUT", "GET"],
		maxAge: 86400,
		credentials: true,
	}),
);

app.route("/api/v0/sso", sso);
app.route("/api/v0/community", community);

export default app;
