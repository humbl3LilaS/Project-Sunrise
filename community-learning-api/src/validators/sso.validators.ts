import type { TUserRole } from "../db/enum";
import z from "zod";
import { UserRole } from "../db/enum";

const password = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/\d/, {
    message: "Password must contain at least one number",
  })
  .regex(/[^A-Z0-9]/i, {
    message: "Password must contain at least one special character",
  });

export const signUpSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Username must be al least 5 characters long" }),
  email: z.email({ message: "Email is required" }),
  age: z.int().positive().min(13, {
    message: "You must be at least 13 years old to use our services",
  }),
  password,
});

export type VTSignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type VTSignInSchema = z.infer<typeof signInSchema>;

export const userInfoUpdateSchema = z
  .object({
    email: z.email({ message: "Email is require" }).optional(),
    name: z
      .string()
      .min(5, { message: "Username must be al least 5 characters long" })
      .optional(),
    password: password.optional(),
  })
  .superRefine((arg, ctx) => {
    if (!arg.email && !arg.name && !arg.password) {
      ctx.addIssue({
        code: "custom",
        message: "At least one payload must be present",
        input: arg.email,
      });
    }
  });

export type VTUserInfoUpdate = z.infer<typeof userInfoUpdateSchema>;

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
