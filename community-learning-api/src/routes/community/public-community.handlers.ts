import type { GetAllPublicCommunitiesRoute } from "./public-community.routes";
import type { AppRouteHandler } from "@/types/app.types";
import { HttpStatus } from "@/types/util.types";
import * as actions from "./public-community.actions";

export const getAllPublicCommunities: AppRouteHandler<GetAllPublicCommunitiesRoute> = async (ctx) => {
  const res = await actions.getAllPublicCommunities();

  if (res.status !== HttpStatus.OK) {
    return ctx.json({ success: false, message: res.message }, res.status);
  }

  return ctx.json({ success: true, data: res.data }, res.status);
};
