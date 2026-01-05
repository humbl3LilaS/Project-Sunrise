import { HTTPStatus } from "../constants/index";

export namespace THttpStatus {
	export type OK = typeof HTTPStatus.OK;
	export type Created = typeof HTTPStatus.Created;
}

const StatusType = {
	success: [HTTPStatus.OK, HTTPStatus.Created] as const,
	userError: [
		HTTPStatus.BadRequest,
		HTTPStatus.Unauthorized,
		HTTPStatus.NotFound,
	] as const,
	serverError: [
		HTTPStatus.InternalServerError,
		HTTPStatus.NotImplemented,
	] as const,
} as const;

type SuccessStatuses = (typeof StatusType.success)[number];
type UserErrorStatuses = (typeof StatusType.userError)[number];
type ServerErrorStatuses = (typeof StatusType.serverError)[number];

export type ActionResponse<T extends SuccessStatuses, D> = Promise<
	| { status: T; data: D }
	| { status: UserErrorStatuses | ServerErrorStatuses; message: string }
>;
