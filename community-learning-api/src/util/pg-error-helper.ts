import {
	HTTPStatus,
	PostgresErrorCode,
	TPostgresErrorCode,
} from "@src/constants";
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

// TODO: Refactor this function to support multilple postgres error code.
export const normalizeDrizzleError = (error: DrizzleQueryError) => {
	if ("code" in error.cause!) {
		const message = PostgresErrorCode[error.cause?.code as TPostgresErrorCode];
		if (!message) {
			return {
				status: HTTPStatus.BadRequest,
				message: "Invalid User Request.",
			};
		}
		return {
			status: HTTPStatus.BadRequest,
			message,
		};
	}
	return {
		status: HTTPStatus.BadRequest,
		message: "Invalid User Request.",
	};
};
