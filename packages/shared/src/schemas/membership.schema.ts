import { z } from "zod";

export const addMemberSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	firstName: z.string().trim().min(1).max(100),
	lastName: z.string().trim().min(1).max(100),
	roleNames: z.array(z.string()).min(1, "At least one role is required"),
});
export type AddMemberDto = z.infer<typeof addMemberSchema>;

export const updateMemberSchema = z.object({
	roleNames: z.array(z.string()).min(1).optional(),
	status: z.enum(["active", "inactive"]).optional(),
});
export type UpdateMemberDto = z.infer<typeof updateMemberSchema>;

export const memberResponseSchema = z.object({
	_id: z.string(),
	userId: z.string(),
	orgId: z.string(),
	email: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string().optional(),
	roleNames: z.array(z.string()),
	directPermissions: z.array(z.string()),
	revokedPermissions: z.array(z.string()),
	status: z.enum(["active", "inactive"]),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type MemberResponse = z.infer<typeof memberResponseSchema>;
