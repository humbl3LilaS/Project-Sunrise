import * as jose from "jose";
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

export const decryptJWTToken = async (token: string) => {
	const secret = Buffer.from(process.env.JWT_SECRET!, "base64");

	const { payload } = await jose.jwtDecrypt(token, secret);
	if (!payload) {
		return {
			sucess: false,
			payload: null,
		};
	}
	return {
		success: true,
		payload,
	};
};
