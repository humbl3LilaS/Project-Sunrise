import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodSchema } from "zod";

export const czValidator = <
	T extends ZodSchema,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T,
) =>
	zValidator(target, schema, (result, ctx) => {
		if (!result.success) {
			const reasons = JSON.parse(result.error.message);
			return ctx.json(
				{
					message: "Bad Request: Invalid Argument",
					reasons,
				},
				400,
			);
		}
	});
