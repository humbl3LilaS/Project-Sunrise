import { DBUserSchema } from "@db/schema";
import { createRoute } from "@hono/zod-openapi";
import {
	createOpenApiSuccessRequest,
	OpenApiErrorResponse,
} from "@utils/open-api-helpers";
import { cz } from "@utils/open-api-zod";
import {
	signInSchema,
	signUpSchema,
	userInfoUpdateSchema,
} from "@valid/sso.validators";

export const docSsoRegister = createRoute({
	method: "post",
	path: "/sign-up",
	request: {
		body: {
			content: {
				"application/json": {
					schema: signUpSchema,
				},
			},
		},
	},
	responses: {
		201: {
			content: {
				"application/json": {
					schema: createOpenApiSuccessRequest(cz.object({ token: cz.string() })),
				},
			},
			description: "User Created Successfully Response.",
		},
		400: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "Duplicated user registration.",
		},
		500: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "Uncaught error. Internal Server Error",
		},
	},
});

export const docSsoSignIn = createRoute({
	method: "post",
	path: "/sign-in",
	request: {
		body: {
			content: {
				"application/json": {
					schema: signInSchema,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: createOpenApiSuccessRequest(cz.object({ token: cz.string() })),
				},
			},
			description: "Login Success Response.",
		},
		400: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "Invalid Password Request.",
		},
		404: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "User was not registered in the system response.",
		},

		500: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "Uncaught error. Internal Server Error",
		},
	},
});

export const docSsoGetMe = createRoute({
	method: "get",
	path: "/me",
	security: [{ BearerAuth: [] }],
	responses: {
		200: {
			content: {
				"application/json": {
					schema: createOpenApiSuccessRequest(
						DBUserSchema.omit({ password: true, role: true }),
					),
				},
			},
			description: "Login Success Response.",
		},
		401: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "Invalid JWT Token Response.",
		},
		404: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "User was not registered in the system response.",
		},
		500: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "Uncaught error. Internal Server Error",
		},
	},
});

export const docSsoUpdateMe = createRoute({
	method: "post",
	path: "/me",
	security: [{ BearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: userInfoUpdateSchema,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: createOpenApiSuccessRequest(
						DBUserSchema.omit({ password: true, role: true }),
					),
				},
			},
			description: "Login Success Response.",
		},
		401: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "Invalid JWT Token Response.",
		},
		404: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "User was not registered in the system response.",
		},
		500: {
			content: {
				"application/json": {
					schema: OpenApiErrorResponse,
				},
			},
			description: "Uncaught error. Internal Server Error",
		},
	},
});
