import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { AuthenticatedUser } from "@tstack/shared";
import type { Request } from "express";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException("Missing access token");
		}

		try {
			const payload = await this.jwtService.verifyAsync<AuthenticatedUser>(
				token,
				{
					secret: this.configService.getOrThrow<string>(
						"jwt.JWT_ACCESS_SECRET",
					),
				},
			);

			if (payload.tokenType !== "access") {
				throw new UnauthorizedException("Invalid token type");
			}

			request.user = payload;
		} catch {
			throw new UnauthorizedException("Invalid or expired access token");
		}

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const authorization = request.headers.authorization;
		if (!authorization) {
			return undefined;
		}
		const [type, token] = authorization.split(" ");
		return type === "Bearer" ? token : undefined;
	}
}
