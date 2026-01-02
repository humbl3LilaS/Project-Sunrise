import { DrizzleQueryError, eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { users } from "../db/schema";
import type { VTSignInSchema, VTSignUpSchema } from "../validators/sso";

export const registerUser = async (payload: VTSignUpSchema) => {
	try {
		const encryptedPassword = await Bun.password.hash(payload.password, {
			algorithm: "bcrypt",
			cost: 4,
		});
		await db.insert(users).values({
			name: payload.username,
			password: encryptedPassword,
			email: payload.email,
			age: payload.age,
		});
		return {
			success: true,
			message: null,
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			const cause = error.cause?.message;
			if (cause!.includes("users_email_unique")) {
				return {
					success: false,
					message: `User account with email ${payload.email} already exist.`,
				};
			}
			return {
				success: false,
				message: error.cause?.message,
			};
		}

		return {
			success: true,
			message: "Internal Server Error",
		};
	}
};

export const verifyUser = async (payload: VTSignInSchema) => {
	try {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, payload.email));
		if (!user) {
			return {
				success: false,
				message: `There is no user with email ${payload.email}`,
			};
		}

		const isPasswordMatch = await Bun.password.verify(
			payload.password,
			user.password,
		);
		if (!isPasswordMatch) {
			return {
				success: false,
				message: "Invalid password",
			};
		}

		return {
			success: true,
			message: "Login successfully",
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			const cause = error.cause?.message;
			if (cause!.includes("users_email_unique")) {
				return {
					success: false,
					message: `User account with email ${payload.email} already exist.`,
				};
			}
			return {
				success: false,
				message: error.cause?.message,
			};
		}
		return {
			success: true,
			message: "Internal Server Error",
		};
	}
};
