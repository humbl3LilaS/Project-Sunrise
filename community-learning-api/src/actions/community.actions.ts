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
): ActionResponse<THttpStatus.OK, TCommnityDetail[]> => {
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
			status: HTTPStatus.OK,
			data: result,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: HTTPStatus.NotFound,
				message: error.message,
			};
		}
		return {
			status: HTTPStatus.InternalServerError,
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
				status: HTTPStatus.NotFound,
				message: "Community not found",
			};
		}

		if (error instanceof Error) {
			return {
				status: HTTPStatus.BadRequest,
				message: error.message,
			};
		}
		return {
			status: HTTPStatus.InternalServerError,
			message: "Internal Server Error",
		};
	}
};

export const createNewCommunity = async (
	userid: string,
	payload: VTCommunityDetail,
): ActionResponse<THttpStatus.Created, TCommnityDetail> => {
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
				status: HTTPStatus.BadRequest,
				message: "Community Creation Failed",
			};
		}
		return {
			status: HTTPStatus.Created,
			data: community,
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			const cause = error.cause?.message;
			if (cause!.includes("community_detail_name_unique")) {
				return {
					status: HTTPStatus.BadRequest,
					message: `Community with name "${payload.name}" already exist.`,
				};
			}
			return {
				status: HTTPStatus.BadRequest,
				message: error.cause?.message ?? "Internal Server Error",
			};
		}
		if (error instanceof Error) {
			return {
				status: HTTPStatus.BadRequest,
				message: error.message,
			};
		}
		return {
			status: HTTPStatus.InternalServerError,
			message: "Internal Server Error",
		};
	}
};

export const addUserToBanList = async (
	userid: string,
	payload: VTBanUserPayload,
): ActionResponse<THttpStatus.Created, TCommunityBanList> => {
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
				status: HTTPStatus.Unauthorized,
				message,
			};
		}

		return {
			status: HTTPStatus.Created,
			data,
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			if (error?.cause?.message.includes("duplicate key value")) {
				return {
					status: HTTPStatus.BadRequest,
					message: `User is already in banlist.`,
				};
			}
			return {
				status: HTTPStatus.BadRequest,
				message: error.cause?.message ?? error.message,
			};
		}

		if (error instanceof Error) {
			return {
				status: HTTPStatus.BadRequest,
				message: error.message,
			};
		}
		return {
			status: HTTPStatus.InternalServerError,
			message: "Internal Server Error",
		};
	}
};
