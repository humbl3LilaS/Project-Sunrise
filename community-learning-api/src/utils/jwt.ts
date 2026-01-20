import * as jose from "jose";
import { jwtPayload, type VTJwtPayload } from "../validators/sso.validators";

export const generateJWTToken = async (
	payload: Record<string, string | number>,
) => {
	const secret = Buffer.from(process.env.JWT_SECRET!, "base64");

	return await new jose.EncryptJWT(payload)
		.setProtectedHeader({
			alg: "dir",
			enc: "A128CBC-HS256",
		})
		.setIssuedAt()
		.setExpirationTime("2h")
		.encrypt(secret);
};

export const decryptJWTToken = async (
	token: string,
): Promise<
	{ success: true; payload: VTJwtPayload } | { success: false; message: string }
> => {
	const secret = Buffer.from(process.env.JWT_SECRET!, "base64");

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
	} catch (error) {
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
