import { DBCommunityDetailSchema } from "@db/schema";
import { createRoute, z } from "@hono/zod-openapi";
import { communityDetailSelectSchema } from "@src/validators/community.validators";
import {
	createOpenApiSuccessRequest,
	OpenApiErrorResponse,
} from "@utils/open-api-helpers";
import { cz } from "@utils/open-api-zod";

export const CommunityId = z.object({
	id: z.uuid().openapi({
		param: { name: "id", in: "path" },
		example: "6eb791c8-849e-453d-bf66-1d907a4485fa",
	}),
});

export const docGetAllCommunities = createRoute({
	method: "get",
	path: "/",
	security: [{ BearerAuth: [] }],
	responses: {
		200: {
			content: {
				"application/json": {
					schema: createOpenApiSuccessRequest(cz.array(DBCommunityDetailSchema)),
				},
			},
			description: "Success Response.",
		},
		404: {
			description: "Not Found Error",
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
		},
		401: {
			description: "JWT ERROR.",
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
		},
		500: {
			description: "Internal Server Error.",
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
		},
	},
});

export const docGetCommunityById = createRoute({
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
		500: {
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
