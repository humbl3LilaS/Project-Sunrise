import { DrizzleQueryError } from "drizzle-orm";

export const isDuplicatedKeyValueConstraintViolation = (error: unknown) => {
	return (
		error instanceof DrizzleQueryError &&
		"code" in error.cause! &&
		error.cause.code === "23505"
	);
};
