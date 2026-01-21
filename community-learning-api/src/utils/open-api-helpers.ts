import { cz } from "./open-api-zod";

export const createOpenApiSuccessRequest = <T>(schema: T) =>
	cz.object({
		success: cz.literal(true),
		data: schema,
	});

export const OpenApiErrorResponse = cz.object({
	success: cz.literal(false),
	message: cz.string(),
});
