import { Test, type TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";

describe("AppController", () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe("health", () => {
		it('should return status "ok"', () => {
			const result = appController.health();
			expect(result.status).toBe("ok");
			expect(result.timestamp).toBeDefined();
		});
	});
});
