import type { SignInRoute, SignUpRoute } from "./sso.routes";
import type { AppRouteHandler } from "@/types/app.types";
import { HttpStatus } from "@/types/util.types";
import * as actions from "./sso.actions";

export const signIn: AppRouteHandler<SignInRoute> = async (ctx) => {
  const payload = ctx.req.valid("json");
  const res = await actions.signIn(payload);

  if (res.status !== HttpStatus.OK) {
    return ctx.json({ success: false, message: res.message }, res.status);
  }

  return ctx.json({ success: true, data: { token: res.data } }, res.status);
};

export const signUp: AppRouteHandler<SignUpRoute> = async (ctx) => {
  const payload = ctx.req.valid("json");
  const res = await actions.signUp(payload);

  if (res.status !== HttpStatus.Created) {
    return ctx.json({ success: false, message: res.message }, res.status);
  }

  return ctx.json({ success: true, data: { token: res.data } }, res.status);
};
