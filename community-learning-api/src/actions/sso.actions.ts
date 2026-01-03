import { DrizzleQueryError, eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import type { TUsers } from "../db/schema";
import { users } from "../db/schema";
import { generateJWTToken } from "../util/jwt";
import type {
	VTSignInSchema,
	VTSignUpSchema,
	VTUserInfoUpdate,
} from "../validators/sso.validators";

export const registerUser = async (payload: VTSignUpSchema) => {
	try {
		const encryptedPassword = await Bun.password.hash(payload.password, {
			algorithm: "bcrypt",
			cost: 4,
		});
		const [data] = await db
			.insert(users)
			.values({
				name: payload.username,
				password: encryptedPassword,
				email: payload.email,
				age: payload.age,
			})
			.returning({ userId: users.id });

		const jwt = await generateJWTToken({
			email: payload.email,
			userid: data.userId,
		});

		return {
			success: true,
			message: null,
			token: jwt,
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

		const jwt = await generateJWTToken({ email: payload.email });

		return {
			success: true,
			message: "Login successfully",
			token: jwt,
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
			success: false,
			message: "Internal Server Error",
		};
	}
};

export const getUserData = async (
	userid: string,
): Promise<
	| {
		status: 200;
		data: TUsers;
	}
	| { status: 404 | 500; message: string }
> => {
	try {
		const [data] = await db.select().from(users).where(eq(users.id, userid));
		if (!data) {
			return {
				status: 404,
				message: "User not found",
			};
		}
		return {
			status: 200,
			data,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: 500,
				message: `Internal Server Error: ${error.message}.`,
			};
		}
		return {
			status: 500,
			message: `Internal Server Error.`,
		};
	}
};

export const updateUserData = async (
	userid: string,
	payload: VTUserInfoUpdate,
): Promise<
	| {
		status: 200;
		data: TUsers;
	}
	| { status: 404 | 500; message: string }
> => {
	try {
		const [data] = await db.select().from(users).where(eq(users.id, userid));
		if (!data) {
			return {
				status: 404,
				message: "User not found",
			};
		}

		const [updatedUserData] = await db
			.update(users)
			.set({ ...data, ...payload })
			.where(eq(users.id, userid))
			.returning();

		return {
			status: 200,
			data: updatedUserData,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: 500,
				message: `Internal Server Error: ${error.message}.`,
			};
		}
		return {
			status: 500,
			message: `Internal Server Error.`,
		};
	}
};
