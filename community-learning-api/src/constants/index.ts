import { CommunityUserRole, TCommunityUserRole } from "../db/enum";

export const communityUserRoleWeight: Map<TCommunityUserRole, number> = new Map(
	CommunityUserRole.enumValues.map((val, idx) => [
		val,
		CommunityUserRole.enumValues.length - idx,
	]),
);
