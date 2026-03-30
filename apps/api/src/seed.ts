import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DatabaseSeeder } from "./modules/seed/database.seeder";

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);

	const seeder = app.get(DatabaseSeeder);

	const args = process.argv.slice(2);
	const fresh = args.includes("--fresh");
	const classArg = args.find((a) => a.startsWith("--class="));
	const className = classArg ? classArg.split("=")[1] : undefined;

	await seeder.run({ fresh, class: className });

	await app.close();
	process.exit(0);
}

bootstrap();
