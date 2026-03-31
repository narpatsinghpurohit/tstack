import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MembershipModule } from "../membership/membership.module";
import { OrganizationController } from "./organization.controller";
import { OrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";
import {
	Organization,
	OrganizationSchema,
} from "./schemas/organization.schema";

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
