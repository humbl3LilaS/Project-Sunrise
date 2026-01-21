import { db } from "@db/drizzle";
import {
	communityBanList,
	communityDetail,
	communityUsers,
	type TCommnityDetail,
} from "@db/schema";
import { HttpStatus, type TActionResponse } from "@src/types/util";
import { and, eq, isNull, ne, or } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";

export const getAllPublicCommunity = async (
	userid: string,
): TActionResponse<TCommnityDetail[], 200 | 404 | 500> => {
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
			status: HttpStatus.OK,
			data: result,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: HttpStatus.NotFound,
				message: error.message,
			};
		}
		return {
			status: HttpStatus.InternalServerError,
			message: "Internal Server Error",
		};
	}
};
//
// export const getCommunityById = async (
// 	communityId: string,
// ): TActionResponse<TCommnityDetail, 200 | 400 | 404 | 501> => {
// 	try {
// 		console.log(communityId);
// 		const [data] = await db
// 			.select()
// 			.from(communityDetail)
// 			.where(eq(communityDetail.id, communityId));
// 		if (!data) {
// 			return {
// 				status: HttpStatus.NotFound,
// 				message: "Community not found",
// 			};
// 		}
// 		return {
// 			status: HttpStatus.OK,
// 			data,
// 		};
// 	} catch (error) {
// 		if (error instanceof DrizzleQueryError) {
// 			return {
// 				status: HttpStatus.NotFound,
// 				message: "Community not found",
// 			};
// 		}
//
// 		if (error instanceof Error) {
// 			return {
// 				status: HttpStatus.BadRequest,
// 				message: error.message,
// 			};
// 		}
// 		return {
// 			status: HttpStatus.InternalServerError,
// 			message: "Internal Server Error",
// 		};
// 	}
// };
//
// export const createNewCommunity = async (
// 	userid: string,
// 	payload: VTCommunityDetail,
// ): TActionResponse<TCommnityDetail, 201> => {
// 	try {
// 		const community = await db.transaction(async (tx) => {
// 			const [community] = await db
// 				.insert(communityDetail)
// 				.values({ ...payload })
// 				.returning();
//
// 			if (!community) {
// 				tx.rollback();
// 				return null;
// 			}
//
// 			const [communityUser] = await db
// 				.insert(communityUsers)
// 				.values({
// 					communityId: community.id,
// 					userId: userid,
// 					userRole: "OWNER",
// 				})
// 				.returning();
// 			if (!communityUser) {
// 				tx.rollback();
// 				return null;
// 			}
// 			return community;
// 		});
// 		if (!community) {
// 			return {
// 				status: HTTPStatus.BadRequest,
// 				message: "Community Creation Failed",
// 			};
// 		}
// 		return {
// 			status: HTTPStatus.Created,
// 			data: community,
// 		};
// 	} catch (error) {
// 		if (error instanceof DrizzleQueryError) {
// 			const cause = error.cause?.message;
// 			if (cause!.includes("community_detail_name_unique")) {
// 				return {
// 					status: HTTPStatus.BadRequest,
// 					message: `Community with name "${payload.name}" already exist.`,
// 				};
// 			}
// 			return {
// 				status: HTTPStatus.BadRequest,
// 				message: error.cause?.message ?? "Internal Server Error",
// 			};
// 		}
// 		if (error instanceof Error) {
// 			return {
// 				status: HTTPStatus.BadRequest,
// 				message: error.message,
// 			};
// 		}
// 		return {
// 			status: HTTPStatus.InternalServerError,
// 			message: "Internal Server Error",
// 		};
// 	}
// };
//
// export const addUserToBanList = async (
// 	userid: string,
// 	payload: VTBanUserPayload,
// ): ActionResponse<THttpStatus.Created, TCommunityBanList> => {
// 	try {
// 		const { data } = await db.transaction(async (tx) => {
// 			const [performer] = await tx
// 				.select()
// 				.from(communityUsers)
// 				.where(
// 					and(
// 						eq(communityUsers.userId, userid),
// 						eq(communityUsers.communityId, payload.communityId),
// 					),
// 				);
//
// 			if (!performer || !performer.userRole) {
// 				throw new CTransactionRollbackError(
// 					"User Don't Have Authority to perform such action.",
// 					HTTPStatus.Unauthorized,
// 				);
// 			}
//
// 			const [target] = await tx
// 				.select()
// 				.from(communityUsers)
// 				.where(
// 					and(
// 						eq(communityUsers.userId, payload.userId),
// 						eq(communityUsers.communityId, payload.communityId),
// 					),
// 				);
// 			if (!target) {
// 				throw new CTransactionRollbackError(
// 					"Can't ban user who aren't the member of this community",
// 					HTTPStatus.BadRequest,
// 				);
// 			}
//
// 			const performerAuthority = authority.get(performer.userRole);
// 			const targetAuthority = authority.get(target.userRole ?? "MEMBER");
//
// 			if (performerAuthority! <= targetAuthority!) {
// 				throw new CTransactionRollbackError(
// 					"User Don't Have Authority to perform such action.",
// 					HTTPStatus.Unauthorized,
// 				);
// 			}
//
// 			const [data] = await tx
// 				.insert(communityBanList)
// 				.values({
// 					communityId: payload.communityId,
// 					userId: payload.userId,
// 				})
// 				.returning();
//
// 			return { data };
// 		});
//
// 		return {
// 			status: HTTPStatus.Created,
// 			data,
// 		};
// 	} catch (error) {
// 		if (error instanceof CTransactionRollbackError) {
// 			return {
// 				status: error.status,
// 				message: error.message,
// 			};
// 		}
// 		if (isDuplicatedKeyValueConstraintViolation(error)) {
// 			return {
// 				status: HTTPStatus.BadRequest,
// 				message: `User is already in banlist.`,
// 			};
// 		}
// 		if (error instanceof Error) {
// 			return {
// 				status: HTTPStatus.BadRequest,
// 				message: error.message,
// 			};
// 		}
// 		return {
// 			status: HTTPStatus.InternalServerError,
// 			message: "Internal Server Error",
// 		};
// 	}
// };
//
// export const joinCommunity = async (
// 	userId: string,
// 	communityId: string,
// ): ActionResponse<THttpStatus.Created, TCommunityUsers> => {
// 	try {
// 		const [data] = await db
// 			.insert(communityUsers)
// 			.values({
// 				userId,
// 				communityId,
// 			})
// 			.returning();
//
// 		return { status: HTTPStatus.Created, data };
// 	} catch (error) {
// 		if (isDuplicatedKeyValueConstraintViolation(error)) {
// 			return {
// 				status: HTTPStatus.BadRequest,
// 				message: "User already registered into the community.",
// 			};
// 		}
// 		if (error instanceof Error) {
// 			return {
// 				status: HTTPStatus.BadRequest,
// 				message: error.message,
// 			};
// 		}
// 		return {
// 			status: HTTPStatus.InternalServerError,
// 			message: "Internal Server Error",
// 		};
// 	}
// };
//
// export const leaveCommunity = async (
// 	userId: string,
// 	communityId: string,
// ): ActionResponse<THttpStatus.OK, TCommunityBanList> => {
// 	try {
// 		const data = await db.transaction(async (tx) => {
// 			const [role] = await tx
// 				.select({ role: communityUsers.userRole })
// 				.from(communityUsers)
// 				.where(
// 					and(
// 						eq(communityUsers.communityId, communityId),
// 						eq(communityUsers.userId, userId),
// 					),
// 				);
// 			if (!role) {
// 				throw new CTransactionRollbackError(
// 					"User is not apart of this community.",
// 					HTTPStatus.BadRequest,
// 				);
// 			}
//
// 			if (role.role === "OWNER") {
// 				throw new CTransactionRollbackError(
// 					"Owner cannot leave the community without transfering ownership to other user.",
// 					HTTPStatus.BadRequest,
// 				);
// 			}
// 			const [data] = await tx
// 				.delete(communityUsers)
// 				.where(
// 					and(
// 						eq(communityUsers.userId, userId),
// 						eq(communityUsers.communityId, communityId),
// 					),
// 				)
// 				.returning();
//
// 			return data;
// 		});
// 		return {
// 			status: HTTPStatus.OK,
// 			data,
// 		};
// 	} catch (error) {
// 		if (error instanceof CTransactionRollbackError) {
// 			return {
// 				status: error.status,
// 				message: error.message,
// 			};
// 		}
//
// 		if (error instanceof DrizzleQueryError) {
// 			return normalizeDrizzleError(error);
// 		}
// 		if (error instanceof Error) {
// 			return {
// 				status: HTTPStatus.BadRequest,
// 				message: error.message,
// 			};
// 		}
// 		return {
// 			status: HTTPStatus.InternalServerError,
// 			message: "Internal Server Error.",
// 		};
// 	}
// };
//
// export const deleteCommunity = async (
// 	userId: string,
// 	communityId: string,
// ): ActionResponse<THttpStatus.OK, null> => {
// 	try {
// 		await db.transaction(async (tx) => {
// 			const [userAuthority] = await tx
// 				.select({ authority: communityUsers.userRole })
// 				.from(communityUsers)
// 				.where(
// 					and(
// 						eq(communityUsers.userId, userId),
// 						eq(communityUsers.communityId, communityId),
// 					),
// 				);
//
// 			if (!userAuthority || !userAuthority.authority) {
// 				throw new CTransactionRollbackError(
// 					"Community Not Found",
// 					HTTPStatus.BadRequest,
// 				);
// 			}
//
// 			if (userAuthority.authority !== "OWNER") {
// 				throw new CTransactionRollbackError(
// 					"User don't have enought authority to delete this community",
// 					HTTPStatus.Forbidden,
// 				);
// 			}
//
// 			const [deletedCommunity] = await tx
// 				.delete(communityDetail)
// 				.where(eq(communityDetail.id, communityId))
// 				.returning();
//
// 			if (!deletedCommunity) {
// 				throw new CTransactionRollbackError(
// 					"Community Not Found",
// 					HTTPStatus.BadRequest,
// 				);
// 			}
// 		});
//
// 		return {
// 			status: HTTPStatus.OK,
// 			data: null,
// 		};
// 	} catch (error) {
// 		if (error instanceof CTransactionRollbackError) {
// 			return {
// 				status: error.status,
// 				message: error.message,
// 			};
// 		}
//
// 		if (error instanceof DrizzleQueryError) {
// 			return normalizeDrizzleError(error);
// 		}
//
// 		if (error instanceof DrizzleQueryError) {
// 			return normalizeDrizzleError(error);
// 		}
// 		if (error instanceof Error) {
// 			return {
// 				status: HTTPStatus.BadRequest,
// 				message: error.message,
// 			};
// 		}
// 		return {
// 			status: HTTPStatus.InternalServerError,
// 			message: "Internal Server Error.",
// 		};
// 	}
// };
