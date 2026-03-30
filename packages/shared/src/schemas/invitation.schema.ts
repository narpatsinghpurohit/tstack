import { z } from "zod";

export const createInvitationSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	roleName: z.string().min(1, "Role is required"),
});
export type CreateInvitationDto = z.infer<typeof createInvitationSchema>;

export const acceptInvitationSchema = z.object({
	token: z.string().min(1),
	firstName: z.string().trim().min(1).max(100).optional(),
	lastName: z.string().trim().min(1).max(100).optional(),
	password: z.string().min(8).max(128).optional(),
});
export type AcceptInvitationDto = z.infer<typeof acceptInvitationSchema>;

export const invitationResponseSchema = z.object({
	_id: z.string(),
	orgId: z.string(),
	orgName: z.string().optional(),
	email: z.string(),
	roleName: z.string(),
	invitedBy: z.string(),
	invitedByName: z.string().optional(),
	expiresAt: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type InvitationResponse = z.infer<typeof invitationResponseSchema>;
