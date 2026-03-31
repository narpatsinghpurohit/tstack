import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleModule } from "../role/role.module";
import { UserModule } from "../user/user.module";
import { MembershipRepository } from "./membership.repository";
import { MembershipService } from "./membership.service";
import { Membership, MembershipSchema } from "./schemas/membership.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Membership.name, schema: MembershipSchema },
		]),
		forwardRef(() => UserModule),
		RoleModule,
	],
	providers: [MembershipRepository, MembershipService],
	exports: [MembershipService, MembershipRepository],
})
export class MembershipModule {}
