import type { SignInRoute } from "./sso.routes";
import type { AppRouteHandler } from "@/types/app.types";
import { HttpStatus } from "@/types/util.types";

export const signIn: AppRouteHandler<SignInRoute> = async (ctx) => {
  return ctx.json({ success: true, message: "Success" }, HttpStatus.OK);
};
