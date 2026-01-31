import type { VTSignInSchema } from "./sso.validators";
import type { TActionResponse } from "@/types/util.types";
import { db } from "@db/drizzle";
import { users } from "@db/schema";
import { generateJWTToken } from "@utils/jwt";
import { and, eq } from "drizzle-orm";

export const signIn = async (payload: VTSignInSchema): TActionResponse<string, 200 | 401 | 500> => {
  try {
    const [user] = await db.select().from(users).where(
      and(
        eq(users.email, payload.email),
      ),
    );
    if (!user) {
      return {
        status: 401,
        message: "Email was not registered in the system.",
      };
    }

    const isPasswordMatch = await Bun.password.verify(payload.password, user.password);
    if (!isPasswordMatch) {
      return {
        status: 401,
        message: "Invalid Credentials",
      };
    }

    const token = await generateJWTToken({ email: payload.email, userid: user.id, role: user.role });
    return {
      status: 200,
      data: token,
    };
  }
  catch (_error) {
    return {
      status: 500,
      message: "Failed To authenticated.",
    };
  }
};
