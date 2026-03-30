import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { PERMISSIONS } from "@tstack/shared";
import type { CreateRoleDto, UpdateRoleDto } from "@tstack/shared";
import { createRoleSchema, updateRoleSchema } from "@tstack/shared";
import { Can } from "../../common/decorators/can.decorator";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import { RoleService } from "./role.service";

@Controller("roles")
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Get()
	@Can(PERMISSIONS.ROLES_VIEW)
	findAll() {
		return this.roleService.findAll();
	}

	@Get(":id")
	@Can(PERMISSIONS.ROLES_VIEW)
	findById(@Param("id") id: string) {
		return this.roleService.findById(id);
	}

	@Post()
	@Can(PERMISSIONS.ROLES_CREATE)
	create(
		@Body(new ZodValidationPipe(createRoleSchema))
		dto: CreateRoleDto,
	) {
		return this.roleService.create(dto);
	}

	@Patch(":id")
	@Can(PERMISSIONS.ROLES_UPDATE)
	update(
		@Param("id") id: string,
		@Body(new ZodValidationPipe(updateRoleSchema))
		dto: UpdateRoleDto,
	) {
		return this.roleService.update(id, dto);
	}

	@Delete(":id")
	@Can(PERMISSIONS.ROLES_DELETE)
	delete(@Param("id") id: string) {
		return this.roleService.delete(id);
	}
}
