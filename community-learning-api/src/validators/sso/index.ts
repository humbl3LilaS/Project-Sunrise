import z from "zod";

const password = z
	.string()
	.min(8, { message: "Password must be at least 8 characters long" })
	.regex(/[A-Z]/, {
		message: "Password must contain at least one uppercase letter",
	})
	.regex(/[a-z]/, {
		message: "Password must contain at least one lowercase letter",
	})
	.regex(/[0-9]/, {
		message: "Password must contain at least one number",
	})
	.regex(/[^A-Za-z0-9]/, {
		message: "Password must contain at least one special character",
	});

export const signUpSchema = z.object({
	username: z
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
