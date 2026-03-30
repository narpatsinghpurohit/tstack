import { registerAs } from "@nestjs/config";
import { z } from "zod";

const appConfigSchema = z.object({
	PORT: z.coerce.number().default(8000),
	MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
	FRONTEND_ORIGIN: z.string().url().default("http://localhost:5173"),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export default registerAs("app", () => {
	const parsed = appConfigSchema.parse({
		PORT: process.env.PORT,
		MONGODB_URI: process.env.MONGODB_URI,
		FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
	});
	return parsed;
});
