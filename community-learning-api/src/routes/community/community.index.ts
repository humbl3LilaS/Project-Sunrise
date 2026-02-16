import { validateJWT } from "@middlewares/jwt-validator";

import { createRouter } from "@utils/create-app";
import * as privateHandlers from "./private-community.handlers";
import * as privateRoutes from "./private-community.routes";
import * as pubilcHandlers from "./public-community.handlers";
import * as publicRoutes from "./public-community.routes";

const communityRouter = createRouter();

const publicCommunityRouter = createRouter().openapi(publicRoutes.getAllPublicCommunities, pubilcHandlers.getAllPublicCommunities);
const privateCommunityRouter = createRouter();
privateCommunityRouter.use(validateJWT);
privateCommunityRouter.openapi(privateRoutes.createNewCommunity, privateHandlers.createNewCommunity);

communityRouter.route("/", publicCommunityRouter).route("/", privateCommunityRouter);

export default communityRouter;
