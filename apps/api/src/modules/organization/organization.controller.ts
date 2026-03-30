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
import { PERMISSIONS } from "@tstack/shared";
import type {
	AddMemberDto,
	AuthenticatedUser,
	CreateOrganizationDto,
	UpdateMemberDto,
	UpdateOrganizationDto,
	UpdateOrganizationStatusDto,
} from "@tstack/shared";
import {
	addMemberSchema,
	createOrganizationSchema,
	updateMemberSchema,
	updateOrganizationSchema,
	updateOrganizationStatusSchema,
} from "@tstack/shared";
import { Can, CanAny } from "../../common/decorators/can.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import { MembershipService } from "../membership/membership.service";
import { OrganizationService } from "./organization.service";

@Controller("organizations")
export class OrganizationController {
	constructor(
		private readonly orgService: OrganizationService,
		private readonly membershipService: MembershipService,
	) {}

	@Get()
	@Can(PERMISSIONS.ORGANIZATIONS_VIEW)
	findAll(
		@Query("page") page?: string,
		@Query("limit") limit?: string,
		@Query("search") search?: string,
	) {
		return this.orgService.findMany({
			page: page ? Number(page) : undefined,
			limit: limit ? Number(limit) : undefined,
			search,
		});
	}

	@Get(":id")
	@Can(PERMISSIONS.ORGANIZATIONS_VIEW)
	findById(@Param("id") id: string) {
		return this.orgService.findById(id);
	}

	@Post()
	@Can(PERMISSIONS.ORGANIZATIONS_CREATE)
	create(
		@CurrentUser() user: AuthenticatedUser,
		@Body(new ZodValidationPipe(createOrganizationSchema))
		dto: CreateOrganizationDto,
	) {
		return this.orgService.create(dto, user.sub);
	}

	@Patch(":id")
	@Can(PERMISSIONS.ORGANIZATIONS_UPDATE)
	update(
		@Param("id") id: string,
		@Body(new ZodValidationPipe(updateOrganizationSchema))
		dto: UpdateOrganizationDto,
	) {
		return this.orgService.update(id, dto);
	}

	@Patch(":id/status")
	@Can(PERMISSIONS.ORGANIZATIONS_MANAGE_STATUS)
	updateStatus(
		@Param("id") id: string,
		@Body(new ZodValidationPipe(updateOrganizationStatusSchema))
		dto: UpdateOrganizationStatusDto,
	) {
		return this.orgService.updateStatus(id, dto);
	}

	@Delete(":id")
	@Can(PERMISSIONS.ORGANIZATIONS_DELETE)
	delete(@Param("id") id: string) {
		return this.orgService.delete(id);
	}

	// --- Member endpoints ---

	@Get(":id/members")
	@CanAny(PERMISSIONS.MEMBERS_VIEW, PERMISSIONS.ACCESS_SUPERADMIN_SURFACE)
	listMembers(
		@CurrentUser() user: AuthenticatedUser,
		@Param("id") orgId: string,
		@Query("page") page?: string,
		@Query("limit") limit?: string,
	) {
		const effectiveOrgId = this.resolveOrgId(user, orgId);
		return this.membershipService.listMembers(effectiveOrgId, {
			page: page ? Number(page) : undefined,
			limit: limit ? Number(limit) : undefined,
		});
	}

	@Post(":id/members")
	@Can(PERMISSIONS.MEMBERS_CREATE)
	addMember(
		@CurrentUser() user: AuthenticatedUser,
		@Param("id") orgId: string,
		@Body(new ZodValidationPipe(addMemberSchema))
		dto: AddMemberDto,
	) {
		const effectiveOrgId = this.resolveOrgId(user, orgId);
		return this.membershipService.addMember(effectiveOrgId, dto);
	}

	@Patch(":id/members/:membershipId")
	@Can(PERMISSIONS.MEMBERS_UPDATE)
	updateMember(
		@CurrentUser() user: AuthenticatedUser,
		@Param("membershipId") membershipId: string,
		@Body(new ZodValidationPipe(updateMemberSchema))
		dto: UpdateMemberDto,
	) {
		return this.membershipService.updateMember(membershipId, dto);
	}

	@Delete(":id/members/:membershipId")
	@Can(PERMISSIONS.MEMBERS_DELETE)
	removeMember(
		@CurrentUser() user: AuthenticatedUser,
		@Param("membershipId") membershipId: string,
	) {
		return this.membershipService.removeMember(membershipId);
	}

	/**
	 * Superadmins can access any org. Regular users can only access their current org.
	 */
	private resolveOrgId(user: AuthenticatedUser, pathOrgId: string): string {
		if (user.permissions.includes(PERMISSIONS.ACCESS_SUPERADMIN_SURFACE)) {
			return pathOrgId;
		}
		return user.orgId!;
	}
}
