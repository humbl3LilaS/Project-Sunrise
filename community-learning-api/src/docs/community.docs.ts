import { createRoute, z } from "@hono/zod-openapi";
import { communityDetailSelectSchema } from "@src/validators/community.validators";
import { cz } from "@utils/open-api-zod";

export const CommunityId = z.object({
	id: z.uuid().openapi({
		param: { name: "id", in: "path" },
		example: "6eb791c8-849e-453d-bf66-1d907a4485fa",
	}),
});

export const createOpenApiSuccessRequest = <T>(schema: T) =>
	cz.object({
		success: cz.literal(true),
		data: schema,
	});

export const OpenApiErrorResponse = cz.object({
	success: cz.literal(false),
	message: cz.string(),
});

export const GetCommunityById = createRoute({
	method: "get",
	path: "/{id}",
	request: {
		params: CommunityId,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: createOpenApiSuccessRequest(communityDetailSelectSchema),
				},
			},
			description: "Success Response",
		},
		404: {
			description: "Not Found Error",
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
		},
		501: {
			description: "Internal Server Error.",
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
		},
	},
	description: "Retrieve Community using Community ID",
});
