import { z } from "zod";

export const updateSystemSettingSchema = z.object({
	key: z.string().min(1),
	value: z.unknown(),
});
export type UpdateSystemSettingDto = z.infer<typeof updateSystemSettingSchema>;

export const updateSystemSettingsSchema = z.object({
	settings: z.array(updateSystemSettingSchema),
});
export type UpdateSystemSettingsDto = z.infer<
	typeof updateSystemSettingsSchema
>;

export const systemSettingResponseSchema = z.object({
	_id: z.string(),
	key: z.string(),
	value: z.unknown(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type SystemSettingResponse = z.infer<typeof systemSettingResponseSchema>;

/**
 * Default system settings seeded on first run.
 */
export const DEFAULT_SYSTEM_SETTINGS = {
	allowSignup: true,
	platformName: "tstack",
	supportEmail: "",
	maintenanceMode: false,
} as const;

export type SystemSettingKey = keyof typeof DEFAULT_SYSTEM_SETTINGS;
