import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type {
	AuthenticatedUser,
	ForgotPasswordRequestDto,
	LoginRequestDto,
	RefreshTokenRequestDto,
	ResetPasswordRequestDto,
	SelectOrgRequestDto,
	SignupRequestDto,
} from "@tstack/shared";
import {
	forgotPasswordRequestSchema,
	loginRequestSchema,
	refreshTokenRequestSchema,
	resetPasswordRequestSchema,
	selectOrgRequestSchema,
	signupRequestSchema,
} from "@tstack/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post("login")
	@HttpCode(HttpStatus.OK)
	@Throttle({ default: { limit: 5, ttl: 60000 } })
	login(
		@Body(new ZodValidationPipe(loginRequestSchema))
		dto: LoginRequestDto,
	) {
		return this.authService.login(dto);
	}

	@Public()
	@Post("signup")
	signup(
		@Body(new ZodValidationPipe(signupRequestSchema))
		dto: SignupRequestDto,
	) {
		return this.authService.signup(dto);
	}

	@Public()
	@Post("refresh")
	@HttpCode(HttpStatus.OK)
	refresh(
		@Body(new ZodValidationPipe(refreshTokenRequestSchema))
		dto: RefreshTokenRequestDto,
	) {
		return this.authService.refresh(dto);
	}

	@Post("logout")
	@HttpCode(HttpStatus.OK)
	logout(@CurrentUser() user: AuthenticatedUser) {
		return this.authService.logout(user.sub);
	}

	@Public()
	@Post("forgot-password")
	@HttpCode(HttpStatus.OK)
	@Throttle({ default: { limit: 3, ttl: 60000 } })
	forgotPassword(
		@Body(new ZodValidationPipe(forgotPasswordRequestSchema))
		dto: ForgotPasswordRequestDto,
	) {
		return this.authService.forgotPassword(dto);
	}

	@Public()
	@Post("reset-password")
	@HttpCode(HttpStatus.OK)
	resetPassword(
		@Body(new ZodValidationPipe(resetPasswordRequestSchema))
		dto: ResetPasswordRequestDto,
	) {
		return this.authService.resetPassword(dto);
	}

	@Post("select-org")
	@HttpCode(HttpStatus.OK)
	selectOrg(
		@CurrentUser() user: AuthenticatedUser,
		@Body(new ZodValidationPipe(selectOrgRequestSchema))
		dto: SelectOrgRequestDto,
	) {
		return this.authService.selectOrg(user.sub, dto);
	}

	@Get("me")
	me(@CurrentUser() user: AuthenticatedUser) {
		return this.authService.me(user.sub);
	}
}
