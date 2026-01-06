import { DrizzleQueryError } from "drizzle-orm";
import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
} from "hono/utils/http-status";

export class CTransactionRollbackError extends Error {
	public readonly status: ServerErrorStatusCode | ClientErrorStatusCode;
	public constructor(
		message: string,
		status: ServerErrorStatusCode | ClientErrorStatusCode,
	) {
		super(message);
		this.status = status;
	}
}

export const isDuplicatedKeyValueConstraintViolation = (error: unknown) => {
	return (
		error instanceof DrizzleQueryError &&
		"code" in error.cause! &&
		error.cause.code === "23505"
	);
};
