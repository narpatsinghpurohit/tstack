import { z } from "zod";

export const createRoleSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(100),
	description: z.string().trim().optional().default(""),
	permissionNames: z.array(z.string()).default([]),
});
export type CreateRoleDto = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = createRoleSchema.partial();
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;

export const roleResponseSchema = z.object({
	_id: z.string(),
	name: z.string(),
	description: z.string(),
	permissionNames: z.array(z.string()),
	isDefault: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type RoleResponse = z.infer<typeof roleResponseSchema>;
