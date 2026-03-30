import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const logger = new Logger("Bootstrap");

	// Global prefix
	app.setGlobalPrefix("api");

	// CORS
	const frontendOrigin = configService.getOrThrow<string>(
		"app.FRONTEND_ORIGIN",
	);
	app.enableCors({
		origin: frontendOrigin,
		credentials: true,
	});

	// Swagger
	const swaggerConfig = new DocumentBuilder()
		.setTitle("tstack API")
		.setDescription("tstack Starter Kit API")
		.setVersion("1.0")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("api/docs", app, document);

	const port = configService.getOrThrow<number>("app.PORT");
	await app.listen(port);
	logger.log(`Application listening on port ${port}`);
	logger.log(
		`Swagger docs available at http://localhost:${port}/api/docs`,
	);
}

bootstrap();
