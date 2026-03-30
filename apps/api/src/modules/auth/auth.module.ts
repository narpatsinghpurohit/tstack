import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MembershipModule } from "../membership/membership.module";
import { OrganizationModule } from "../organization/organization.module";
import { SystemSettingModule } from "../system-setting/system-setting.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		JwtModule.register({}),
		UserModule,
		OrganizationModule,
		MembershipModule,
		SystemSettingModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
