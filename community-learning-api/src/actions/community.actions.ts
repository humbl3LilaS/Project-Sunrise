import { and, DrizzleQueryError, eq, isNull, ne, or } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";
import {
	communityUserRoleWeight as authority,
	HTTPStatus,
} from "../constants/index";
import { db } from "../db/drizzle";
import type { TCommnityDetail, TCommunityBanList } from "../db/schema";
import {
	communityBanList,
	communityDetail,
	communityUsers,
} from "../db/schema";
import type { ActionResponse, THttpStatus } from "../types/util";

import type {
	VTBanUserPayload,
	VTCommunityDetail,
} from "../validators/community.validators";

export const getAllPublicCommunity = async (
	userid: string,
): Promise<
	| { status: 200; data: TCommnityDetail[] }
	| { status: 400 | 500; message: string }
> => {
	try {
		/*
		 * This query select all communities which are "PUBLIC" and User has not been banned on.
		 * */
		const publicCommunities = db
			.select({
				id: communityDetail.id,
				name: communityDetail.name,
				description: communityDetail.description,
				type: communityDetail.type,
				bgUrl: communityDetail.bgUrl,
			})
			.from(communityDetail)
			.leftJoin(communityUsers, eq(communityDetail.id, communityUsers.communityId))
			.leftJoin(
				communityBanList,
				eq(communityDetail.id, communityBanList.communityId),
			)
			.where(
				and(
					eq(communityDetail.type, "PUBLIC"),
					or(isNull(communityBanList.userId), ne(communityBanList.userId, userid)),
				),
			);

		/*
		 * This query select every community in which user is apart of.
		 * */
		const userRelatedCommunities = db
			.select({
				id: communityDetail.id,
				name: communityDetail.name,
				description: communityDetail.description,
				type: communityDetail.type,
				bgUrl: communityDetail.bgUrl,
			})
			.from(communityDetail)
			.leftJoin(communityUsers, eq(communityDetail.id, communityUsers.communityId))
			.where(eq(communityUsers.userId, userid));

		/*
		 * Union the result set of publicCommunites and userRelatedCummunities to eliminate duplicated values.
		 * */
		const result = await union(publicCommunities, userRelatedCommunities);

		return {
			status: 200,
			data: result,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: 400,
				message: error.message,
			};
		}
		return {
			status: 500,
			message: "Internal Server Error",
		};
	}
};

export const getCommunityById = async (
	communityId: string,
): ActionResponse<THttpStatus.OK, TCommnityDetail> => {
	try {
		console.log(communityId);
		const [data] = await db
			.select()
			.from(communityDetail)
			.where(eq(communityDetail.id, communityId));
		if (!data) {
			return {
				status: HTTPStatus.NotFound,
				message: "Community not found",
			};
		}
		return {
			status: HTTPStatus.OK,
			data,
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			return {
				status: 404,
				message: "Community not found",
			};
		}

		if (error instanceof Error) {
			return {
				status: 400,
				message: error.message,
			};
		}
		return {
			status: 500,
			message: "Internal Server Error",
		};
	}
};

export const createNewCommunity = async (
	userid: string,
	payload: VTCommunityDetail,
): Promise<
	{ status: 201; data: TCommnityDetail } | { status: 400 | 500; message: string }
> => {
	try {
		const community = await db.transaction(async (tx) => {
			const [community] = await db
				.insert(communityDetail)
				.values({ ...payload })
				.returning();

			if (!community) {
				tx.rollback();
				return null;
			}

			const [communityUser] = await db
				.insert(communityUsers)
				.values({
					communityId: community.id,
					userId: userid,
					userRole: "OWNER",
				})
				.returning();
			if (!communityUser) {
				tx.rollback();
				return null;
			}
			return community;
		});
		if (!community) {
			return {
				status: 400,
				message: "Community Creation Failed",
			};
		}
		return {
			status: 201,
			data: community,
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			const cause = error.cause?.message;
			if (cause!.includes("community_detail_name_unique")) {
				return {
					status: 400,
					message: `Community with name "${payload.name}" already exist.`,
				};
			}
			return {
				status: 400,
				message: error.cause?.message ?? "Internal Server Error",
			};
		}
		if (error instanceof Error) {
			return {
				status: 400,
				message: error.message,
			};
		}
		return {
			status: 500,
			message: "Internal Server Error",
		};
	}
};

export const addUserToBanList = async (
	userid: string,
	payload: VTBanUserPayload,
): Promise<
	| { status: 201; data: TCommunityBanList }
	| { status: 401 | 400 | 500; message: string }
> => {
	try {
		const { data, message } = await db.transaction(async (tx) => {
			const [performer] = await tx
				.select()
				.from(communityUsers)
				.where(
					and(
						eq(communityUsers.userId, userid),
						eq(communityUsers.communityId, payload.communityId),
					),
				);

			if (!performer || !performer.userRole) {
				return {
					data: null,
					message: "User Don't Have Authority to perform such action.",
				};
			}

			const [target] = await tx
				.select()
				.from(communityUsers)
				.where(
					and(
						eq(communityUsers.userId, userid),
						eq(communityUsers.communityId, payload.communityId),
					),
				);

			const performerAuthority = authority.get(performer.userRole);
			const targetAuthority = authority.get(target.userRole ?? "MEMBER");

			if (performerAuthority! <= targetAuthority!) {
				return {
					data: null,
					message: "User Don't Have Authority to perform such action.",
				};
			}

			const [data] = await tx
				.insert(communityBanList)
				.values({
					communityId: payload.communityId,
					userId: payload.userId,
				})
				.returning();

			return { data, message: null };
		});

		if (!data) {
			return {
				status: 401,
				message,
			};
		}

		return {
			status: 201,
			data,
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			if (error?.cause?.message.includes("duplicate key value")) {
				return {
					status: 400,
					message: `User is already in banlist.`,
				};
			}
			return {
				status: 400,
				message: error.cause?.message ?? error.message,
			};
		}

		if (error instanceof Error) {
			return {
				status: 400,
				message: error.message,
			};
		}
		return {
			status: 500,
			message: "Internal Server Error",
		};
	}
};
