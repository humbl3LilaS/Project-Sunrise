import { CommunityUserRole, type TCommunityUserRole } from "../db/enum";

export const communityUserRoleWeight: Map<TCommunityUserRole, number> = new Map(
	CommunityUserRole.enumValues.map((val: TCommunityUserRole, idx: number) => [
		val,
		CommunityUserRole.enumValues.length - idx,
	]),
);

export const HTTPStatus = {
	OK: 200,
	Created: 201,
	NoContent: 204,
	BadRequest: 400,
	Unauthorized: 401,
	NotFound: 404,
	Forbidden: 403,
	InternalServerError: 500,
	NotImplemented: 501,
} as const;

export const ApiErrorResponses = [400, 401, 403, 404, 422, 500] as const;
export type TApiErrorResponses = (typeof ApiErrorResponses)[number];

export const ErrorResponseDescirptionMap = [
	{ status: 400, desc: "Response of Bad Request" },
	{ status: 401, desc: "Response of Unauthorized Request" },
	{ status: 403, desc: "Response of Forbidden Request" },
	{ status: 404, desc: "Response of Not Found Request" },
	{ status: 422, desc: "Response of Too Many Request" },
	{ status: 500, desc: "Response of Internal Server Error" },
] as unknown as Array<{ status: TApiErrorResponses; message: string }>;

// TODO: Refactor this later
export const PostgresErrorCode = {
	"22P02": "Invalid Input Syntax For Operation Query Condition.",
} as const;

export type TPostgresErrorCode = keyof typeof PostgresErrorCode;
