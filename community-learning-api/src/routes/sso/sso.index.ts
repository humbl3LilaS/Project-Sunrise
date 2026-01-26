import { createRouter } from "@utils/create-app";

import * as handlers from "./sso.handlers";
import * as routes from "./sso.routes";

const ssoRouter = createRouter().openapi(routes.signIn, handlers.signIn);

export default ssoRouter;
