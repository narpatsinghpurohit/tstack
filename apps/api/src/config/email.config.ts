import { registerAs } from "@nestjs/config";
import { z } from "zod";

const emailConfigSchema = z.object({
	SMTP_HOST: z.string().default(""),
	SMTP_PORT: z.coerce.number().default(587),
	SMTP_USER: z.string().default(""),
	SMTP_PASS: z.string().default(""),
	SMTP_FROM_EMAIL: z.string().default("noreply@tstack.app"),
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;

export default registerAs("email", () => {
	const parsed = emailConfigSchema.parse({
		SMTP_HOST: process.env.SMTP_HOST,
		SMTP_PORT: process.env.SMTP_PORT,
		SMTP_USER: process.env.SMTP_USER,
		SMTP_PASS: process.env.SMTP_PASS,
		SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
	});
	return parsed;
});
