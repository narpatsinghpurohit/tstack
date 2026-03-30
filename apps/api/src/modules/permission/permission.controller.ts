import { Controller, Get } from "@nestjs/common";
import { PERMISSIONS } from "@tstack/shared";
import { Can } from "../../common/decorators/can.decorator";
import { PermissionService } from "./permission.service";

@Controller("permissions")
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	@Get()
	@Can(PERMISSIONS.ROLES_VIEW)
	findAll() {
		return this.permissionService.findAll();
	}

	@Get("grouped")
	@Can(PERMISSIONS.ROLES_VIEW)
	findAllGrouped() {
		return this.permissionService.findAllGrouped();
	}
}
