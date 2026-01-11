import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
	SuccessStatusCode,
} from "hono/utils/http-status";
import type { HTTPStatus } from "../constants/index";

export namespace THttpStatus {
	export type OK = typeof HTTPStatus.OK;
	export type Created = typeof HTTPStatus.Created;
	export type NoContent = typeof HTTPStatus.NoContent;
}

// const StatusType = {
// 	success: [HTTPStatus.OK, HTTPStatus.Created] as const,
// 	userError: [
// 		HTTPStatus.BadRequest,
// 		HTTPStatus.Unauthorized,
// 		HTTPStatus.NotFound,
// 	] as const,
// 	serverError: [
// 		HTTPStatus.InternalServerError,
// 		HTTPStatus.NotImplemented,
// 	] as const,
// } as const;
//
// export type SuccessStatuses = (typeof StatusType.success)[number];
// export type UserErrorStatuses = (typeof StatusType.userError)[number];
// export type ServerErrorStatuses = (typeof StatusType.serverError)[number];

export type ActionResponse<T extends SuccessStatusCode, D> = Promise<
	| { status: T; data: D }
	| { status: ServerErrorStatusCode | ClientErrorStatusCode; message: string }
>;
