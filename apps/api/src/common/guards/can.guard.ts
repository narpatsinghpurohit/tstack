import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AuthenticatedUser } from "@tstack/shared";
import {
	REQUIRED_PERMISSIONS_KEY,
	REQUIRED_PERMISSIONS_MODE_KEY,
} from "../decorators/can.decorator";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class CanGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		const requiredPermissions = this.reflector.getAllAndOverride<
			string[] | undefined
		>(REQUIRED_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

		if (!requiredPermissions || requiredPermissions.length === 0) {
			return true;
		}

		const mode =
			this.reflector.getAllAndOverride<"all" | "any">(
				REQUIRED_PERMISSIONS_MODE_KEY,
				[context.getHandler(), context.getClass()],
			) ?? "all";

		const request = context.switchToHttp().getRequest();
		const user = request.user as AuthenticatedUser;

		if (!user?.permissions) {
			throw new ForbiddenException("Insufficient permissions");
		}

		const hasPermission =
			mode === "all"
				? requiredPermissions.every((p) => user.permissions.includes(p))
				: requiredPermissions.some((p) => user.permissions.includes(p));

		if (!hasPermission) {
			throw new ForbiddenException("Insufficient permissions");
		}

		return true;
	}
}
