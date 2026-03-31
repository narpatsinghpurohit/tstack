import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import type {
	AuthenticatedUser,
	ChangePasswordDto,
	CreateUserDto,
	UpdateProfileDto,
	UpdateUserInfoDto,
	UpdateUserRolesDto,
} from "@tstack/shared";
import {
	changePasswordSchema,
	createUserSchema,
	PERMISSIONS,
	updateProfileSchema,
	updateUserInfoSchema,
	updateUserRolesSchema,
} from "@tstack/shared";
import { Can } from "../../common/decorators/can.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@Can(PERMISSIONS.PLATFORM_USERS_VIEW)
	findAll(
		@Query("page") page?: string,
		@Query("limit") limit?: string,
		@Query("search") search?: string,
	) {
		return this.userService.findMany({
			page: page ? Number(page) : undefined,
			limit: limit ? Number(limit) : undefined,
			search,
		});
	}

	@Get("profile")
	getProfile(@CurrentUser() user: AuthenticatedUser) {
		return this.userService.findById(user.sub);
	}

	@Patch("profile")
	updateProfile(
		@CurrentUser() user: AuthenticatedUser,
		@Body(new ZodValidationPipe(updateProfileSchema))
		dto: UpdateProfileDto,
	) {
		return this.userService.updateProfile(user.sub, dto);
	}

	@Patch("change-password")
	changePassword(
		@CurrentUser() user: AuthenticatedUser,
		@Body(new ZodValidationPipe(changePasswordSchema))
		dto: ChangePasswordDto,
	) {
		return this.userService.changePassword(user.sub, dto);
	}

	@Get(":id")
	@Can(PERMISSIONS.PLATFORM_USERS_VIEW)
	findById(@Param("id") id: string) {
		return this.userService.findById(id);
	}

	@Post()
	@Can(PERMISSIONS.PLATFORM_USERS_CREATE)
	create(
		@Body(new ZodValidationPipe(createUserSchema))
		dto: CreateUserDto,
	) {
		return this.userService.create(dto);
	}

	@Patch(":id")
	@Can(PERMISSIONS.PLATFORM_USERS_UPDATE)
	updateInfo(
		@Param("id") id: string,
		@Body(new ZodValidationPipe(updateUserInfoSchema))
		dto: UpdateUserInfoDto,
	) {
		return this.userService.updateInfo(id, dto);
	}

	@Patch(":id/roles")
	@Can(PERMISSIONS.PLATFORM_USERS_UPDATE)
	updateRoles(
		@Param("id") id: string,
		@Body(new ZodValidationPipe(updateUserRolesSchema))
		dto: UpdateUserRolesDto,
	) {
		return this.userService.updateRoles(id, dto);
	}

	@Delete(":id")
	@Can(PERMISSIONS.PLATFORM_USERS_DELETE)
	delete(@Param("id") id: string) {
		return this.userService.delete(id);
	}
}
