import type { CreateNewCommunityRoute } from "./private-community.routes";
import type { AppRouteHandler } from "@/types/app.types";
import * as actions from "./priavte-community.actions";

export const createNewCommunity: AppRouteHandler<CreateNewCommunityRoute> = async (ctx) => {
  const payload = ctx.req.valid("json");
  const userId = ctx.var.jwtToken.userid;

  const res = await actions.createNewCommunity(payload, userId);

  if (res.status !== 201) {
    return ctx.json({
      success: false,
      message: res.message,
    }, res.status);
  }

  return ctx.json({
    success: true,
    data: res.data,
  }, res.status);
};
