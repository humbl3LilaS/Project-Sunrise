import { Hono } from "hono";
import { sso } from "./routes/sso";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.route("/api/v0/sso", sso);

export default app;
