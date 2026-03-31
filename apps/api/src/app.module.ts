import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { CanGuard } from "./common/guards/can.guard";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import appConfig from "./config/app.config";
import emailConfig from "./config/email.config";
import jwtConfig from "./config/jwt.config";
import { DatabaseModule } from "./core/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { EmailModule } from "./modules/email/email.module";
import { InvitationModule } from "./modules/invitation/invitation.module";
import { MembershipModule } from "./modules/membership/membership.module";
import { OrganizationModule } from "./modules/organization/organization.module";
import { PermissionModule } from "./modules/permission/permission.module";
import { RoleModule } from "./modules/role/role.module";
import { SeedModule } from "./modules/seed/seed.module";
import { SystemSettingModule } from "./modules/system-setting/system-setting.module";
import { UserModule } from "./modules/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig, jwtConfig, emailConfig],
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 60,
			},
		]),
		JwtModule.register({}),
		DatabaseModule,
		EmailModule,
		AuthModule,
		UserModule,
		OrganizationModule,
		MembershipModule,
		RoleModule,
		PermissionModule,
		InvitationModule,
		SystemSettingModule,
		SeedModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: CanGuard,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
