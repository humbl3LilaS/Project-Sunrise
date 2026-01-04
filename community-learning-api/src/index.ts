import { Hono } from "hono";
import { cors } from "hono/cors";
import { sso } from "./routes/sso.route";
import { community } from "./routes/community.route";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

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
