import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import type {
	AcceptInvitationDto,
	AuthenticatedUser,
	CreateInvitationDto,
} from "@tstack/shared";
import {
	acceptInvitationSchema,
	createInvitationSchema,
	PERMISSIONS,
} from "@tstack/shared";
import { Can } from "../../common/decorators/can.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe";
import { InvitationService } from "./invitation.service";

@Controller("invitations")
export class InvitationController {
	constructor(private readonly invitationService: InvitationService) {}

	@Post("org/:orgId")
	@Can(PERMISSIONS.INVITATIONS_CREATE)
	create(
		@CurrentUser() user: AuthenticatedUser,
		@Body(new ZodValidationPipe(createInvitationSchema))
		dto: CreateInvitationDto,
	) {
		return this.invitationService.create(
			user.orgId!,
			dto,
			user.sub,
			user.email,
		);
	}

	@Get("org/:orgId")
	@Can(PERMISSIONS.INVITATIONS_VIEW)
	listByOrg(
		@CurrentUser() user: AuthenticatedUser,
		@Query("page") page?: string,
		@Query("limit") limit?: string,
	) {
		return this.invitationService.listByOrg(user.orgId!, {
			page: page ? Number(page) : undefined,
			limit: limit ? Number(limit) : undefined,
		});
	}

	@Public()
	@Post("accept")
	accept(
		@Body(new ZodValidationPipe(acceptInvitationSchema))
		dto: AcceptInvitationDto,
	) {
		return this.invitationService.accept(dto);
	}

	@Delete(":id")
	@Can(PERMISSIONS.INVITATIONS_DELETE)
	delete(@Param("id") id: string) {
		return this.invitationService.delete(id);
	}
}
