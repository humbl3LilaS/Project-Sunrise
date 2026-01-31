import type { TUserRole } from "@db/enum";
import { UserRole } from "@db/enum";
import * as jose from "jose";
import z from "zod";
import env from "./env";

export const jwtPayload = z.object({
  email: z.email({ message: "Email is required" }),
  userid: z.string().min(1, { message: "Userid is requried" }),
  role: z
    .string()
    .refine(value => UserRole.enumValues.includes(value as TUserRole)),
  iat: z.number().positive(),
  exp: z.number().positive(),
});

export type VTJwtPayload = z.infer<typeof jwtPayload>;

export const generateJWTToken = async (payload: Record<string, string | number>) => {
  const secret = Buffer.from(env.JWT_SECRET, "base64");

  return await new jose.EncryptJWT(payload)
    .setProtectedHeader({
      alg: "dir",
      enc: "A128CBC-HS256",
    })
    .setIssuedAt()
    .setExpirationTime("2h")
    .encrypt(secret);
};

export const decryptJWTToken = async (token: string): Promise<{ success: true; payload: VTJwtPayload } | { success: false; message: string }
> => {
  const secret = Buffer.from(env.JWT_SECRET, "base64");

  try {
    const { payload } = await jose.jwtDecrypt(token, secret);

    if (!payload) {
      return {
        success: false,
        message: "Invalid Token",
      };
    }

    const { data, success } = jwtPayload.safeParse(payload);

    if (!success) {
      return {
        success: false,
        message: "Invalid Token Payload",
      };
    }

    return {
      success: true,
      payload: data,
    };
  }
  catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `${error.name}: ${error.message}`,
      };
    }
    return {
      success: false,
      message: "Invalid Token",
    };
  }
};
