import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MembershipModule } from "../membership/membership.module";
import { OrganizationController } from "./organization.controller";
import { OrganizationRepository } from "./organization.repository";
import {
	Organization,
	OrganizationSchema,
} from "./schemas/organization.schema";
import { OrganizationService } from "./organization.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Organization.name, schema: OrganizationSchema },
		]),
		MembershipModule,
	],
	controllers: [OrganizationController],
	providers: [OrganizationRepository, OrganizationService],
	exports: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
