import { db } from "@db/drizzle";
import { type TUsers, users } from "@db/schema";
import { HttpStatus, type TActionResponse } from "@src/types/util";
import { generateJWTToken } from "@utils/jwt";
import type {
	VTSignInSchema,
	VTSignUpSchema,
	VTUserInfoUpdate,
} from "@valid/sso.validators";
import { DrizzleQueryError, eq } from "drizzle-orm";

export const registerUser = async (
	payload: VTSignUpSchema,
): TActionResponse<string, 201 | 400 | 500> => {
	try {
		const encryptedPassword = await Bun.password.hash(payload.password, {
			algorithm: "bcrypt",
			cost: 4,
		});
		const [data] = await db
			.insert(users)
			.values({
				...payload,
				password: encryptedPassword,
			})
			.returning({ userId: users.id, role: users.role });

		const jwt = await generateJWTToken({
			email: payload.email,
			userid: data.userId,
			role: data.role,
		});

		return {
			status: HttpStatus.Created,
			data: jwt,
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			const cause = error.cause?.message;
			if (cause!.includes("users_email_unique")) {
				return {
					status: HttpStatus.BadRequest,
					message: `User account with email ${payload.email} already exist.`,
				};
			}
			return {
				status: HttpStatus.BadRequest,
				message: error.cause?.message ?? error.message,
			};
		}

		return {
			status: HttpStatus.InternalServerError,
			message: "Internal Server Error",
		};
	}
};

export const verifyUser = async (
	payload: VTSignInSchema,
): TActionResponse<string, 200 | 400 | 404 | 500> => {
	try {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, payload.email));
		if (!user) {
			return {
				status: HttpStatus.NotFound,
				message: `There is no user with email ${payload.email}`,
			};
		}

		const isPasswordMatch = await Bun.password.verify(
			payload.password,
			user.password,
		);
		if (!isPasswordMatch) {
			return {
				status: HttpStatus.BadRequest,
				message: "Invalid password.",
			};
		}

		const jwt = await generateJWTToken({
			email: payload.email,
			userid: user.id,
			role: user.role,
		});

		return {
			status: 200,
			data: jwt,
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			const cause = error.cause?.message;
			if (cause!.includes("users_email_unique")) {
				return {
					status: HttpStatus.BadRequest,
					message: `User account with email ${payload.email} already exist.`,
				};
			}
			return {
				status: HttpStatus.BadRequest,
				message: error.cause?.message ?? error.message,
			};
		}
		return {
			status: HttpStatus.InternalServerError,
			message: "Internal Server Error.",
		};
	}
};

export const getUserData = async (
	userid: string,
): TActionResponse<TUsers, 200 | 404 | 500> => {
	try {
		const [data] = await db.select().from(users).where(eq(users.id, userid));
		if (!data) {
			return {
				status: HttpStatus.NotFound,
				message: "User not found",
			};
		}
		return {
			status: HttpStatus.OK,
			data,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: HttpStatus.InternalServerError,
				message: `Internal Server Error: ${error.message}.`,
			};
		}
		return {
			status: HttpStatus.InternalServerError,
			message: `Internal Server Error.`,
		};
	}
};

export const updateUserData = async (
	userid: string,
	payload: VTUserInfoUpdate,
): TActionResponse<TUsers, 200 | 404 | 500> => {
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
