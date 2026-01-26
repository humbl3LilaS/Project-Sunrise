import createApp from "@utils/create-app";
import { configureOpenApi } from "@utils/open-api";

const app = createApp();

configureOpenApi(app);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
