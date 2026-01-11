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

// TODO: Refactor this later
export const PostgresErrorCode = {
	"22P02": "Invalid Input Syntax For Operation Query Condition.",
} as const;

export type TPostgresErrorCode = keyof typeof PostgresErrorCode;
