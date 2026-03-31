import { z } from "zod";

export const createOrganizationSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(200),
	contactEmail: z.string().email().trim().toLowerCase(),
	contactPhone: z.string().trim().optional().default(""),
	address: z.string().trim().optional().default(""),
});
export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();
export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>;

export const updateOrganizationStatusSchema = z.object({
	status: z.enum(["active", "suspended", "inactive"]),
});
export type UpdateOrganizationStatusDto = z.infer<
	typeof updateOrganizationStatusSchema
>;

export const organizationResponseSchema = z.object({
	_id: z.string(),
	name: z.string(),
	slug: z.string(),
	ownerId: z.string(),
	contactEmail: z.string(),
	contactPhone: z.string(),
	address: z.string(),
	status: z.enum(["active", "suspended", "inactive"]),
	isPersonal: z.boolean(),
	logoUrl: z.string().nullable(),
	memberCount: z.number().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type OrganizationResponse = z.infer<typeof organizationResponseSchema>;
