import ssoRouter from "@routes/sso/sso.index";
import createApp from "@utils/create-app";
import { configureOpenApi } from "@utils/open-api";

const app = createApp();

configureOpenApi(app);

const routes = [ssoRouter] as const;

routes.forEach((route) => {
  app.route("/api/v0", route);
});

export type AppType = typeof routes[number];

export default app;
