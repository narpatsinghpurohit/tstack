import { z } from "zod";

export const uploadResponseSchema = z.object({
	url: z.string(),
	key: z.string(),
	originalName: z.string(),
	size: z.number(),
	mimeType: z.string(),
});
export type UploadResponse = z.infer<typeof uploadResponseSchema>;

export const deleteUploadSchema = z.object({
	key: z.string().min(1),
});
export type DeleteUploadDto = z.infer<typeof deleteUploadSchema>;
