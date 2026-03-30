import { z } from "zod";

// --- Profile Update (self) ---
export const updateProfileSchema = z.object({
	firstName: z.string().trim().min(1).max(100).optional(),
	lastName: z.string().trim().min(1).max(100).optional(),
	phone: z.string().trim().optional(),
});
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

// --- Change Password (self) ---
export const changePasswordSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: z.string().min(8).max(128),
});
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

// --- Admin: Create User ---
export const createUserSchema = z.object({
	firstName: z.string().trim().min(1).max(100),
	lastName: z.string().trim().min(1).max(100),
	email: z.string().email().trim().toLowerCase(),
	password: z.string().min(8).max(128),
	phone: z.string().trim().optional().default(""),
	roleNames: z.array(z.string()).default([]),
});
export type CreateUserDto = z.infer<typeof createUserSchema>;

// --- Admin: Update User Info ---
export const updateUserInfoSchema = z.object({
	firstName: z.string().trim().min(1).max(100).optional(),
	lastName: z.string().trim().min(1).max(100).optional(),
	email: z.string().email().trim().toLowerCase().optional(),
	phone: z.string().trim().optional(),
	status: z.enum(["active", "inactive"]).optional(),
});
export type UpdateUserInfoDto = z.infer<typeof updateUserInfoSchema>;

// --- Admin: Update User Roles ---
export const updateUserRolesSchema = z.object({
	roleNames: z.array(z.string()),
	directPermissions: z.array(z.string()).optional(),
	revokedPermissions: z.array(z.string()).optional(),
});
export type UpdateUserRolesDto = z.infer<typeof updateUserRolesSchema>;

// --- User Response ---
export const userResponseSchema = z.object({
	_id: z.string(),
	email: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string(),
	status: z.enum(["active", "inactive"]),
	roleNames: z.array(z.string()),
	directPermissions: z.array(z.string()),
	revokedPermissions: z.array(z.string()),
	currentOrgId: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type UserResponse = z.infer<typeof userResponseSchema>;
