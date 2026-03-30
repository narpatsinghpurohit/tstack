import { registerAs } from "@nestjs/config";
import { z } from "zod";

const jwtConfigSchema = z.object({
	JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
	JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
	JWT_ACCESS_TTL: z.string().default("15m"),
	JWT_REFRESH_TTL: z.string().default("7d"),
});

export type JwtConfig = z.infer<typeof jwtConfigSchema>;

export default registerAs("jwt", () => {
	const parsed = jwtConfigSchema.parse({
		JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
		JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
		JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL,
		JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL,
	});
	return parsed;
});
