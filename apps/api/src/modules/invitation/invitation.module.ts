import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MembershipModule } from "../membership/membership.module";
import { OrganizationModule } from "../organization/organization.module";
import { UserModule } from "../user/user.module";
import { InvitationController } from "./invitation.controller";
import { InvitationRepository } from "./invitation.repository";
import {
	Invitation,
	InvitationSchema,
} from "./schemas/invitation.schema";
import { InvitationService } from "./invitation.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Invitation.name, schema: InvitationSchema },
		]),
		UserModule,
		MembershipModule,
		OrganizationModule,
	],
	controllers: [InvitationController],
	providers: [InvitationRepository, InvitationService],
	exports: [InvitationService],
})
export class InvitationModule {}
