import type { AuthenticatedUser } from "@tstack/shared";

declare global {
	namespace Express {
		interface Request {
			user?: AuthenticatedUser;
		}
	}
}
