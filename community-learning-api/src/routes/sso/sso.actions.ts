import type { VTSignInSchema, VTSignUpSchema } from "./sso.validators";
import type { TActionResponse } from "@/types/util.types";
import { db } from "@db/drizzle";
import { users } from "@db/schema";
import { generateJWTToken } from "@utils/jwt";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { HttpStatus } from "@/types/util.types";

export const signIn = async (payload: VTSignInSchema): TActionResponse<string, 200 | 400 | 500> => {
  try {
    const [user] = await db.select().from(users).where(
      and(
        eq(users.email, payload.email),
      ),
    );
    if (!user) {
      return {
        status: 400,
        message: "Email was not registered in the system.",
      };
    }

    const isPasswordMatch = await Bun.password.verify(payload.password, user.password);
    if (!isPasswordMatch) {
      return {
        status: 400,
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

export const signUp = async (payload: VTSignUpSchema): TActionResponse<string, 201 | 400 | 500> => {
  try {
    const hashedPassword = await Bun.password.hash(payload.password);

    const [data] = await db.insert(users).values({
      email: payload.email,
      name: payload.name,
      age: payload.age,
      password: hashedPassword,
    }).returning();

    if (!data) {
      return {
        status: HttpStatus.BadRequest,
        message: "Bad Request",
      };
    }

    const token = await generateJWTToken({ userid: data.id, email: data.email, role: data.role });

    return {
      status: HttpStatus.Created,
      data: token,
    };
  }
  catch (error) {
    if (error instanceof DrizzleQueryError) {
      if (error.cause && "code" in error.cause && error.cause.code === "23505") {
        return {
          status: 400,
          message: `Bad Request: User with email ${payload.email} already exist.`,
        };
      }
      return {
        status: 400,
        message: "Error during sign-in process.",
      };
    }
    return {
      status: HttpStatus.InternalServerError,
      message: "Failed to Sign Up User.",
    };
  }
};
