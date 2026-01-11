import { createRoute, z } from "@hono/zod-openapi";
import { CommunityDetailSelectSchema } from "@src/validators/community.validators";

const CommunityId = z.object({
	id: z
		.uuid()
		.openapi({ param: { name: "id", in: "path" }, example: "asdfafadfs" }),
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
					schema: CommunityDetailSelectSchema,
				},
			},
			description: "Retrieve Community using Community ID",
		},
	},
});
