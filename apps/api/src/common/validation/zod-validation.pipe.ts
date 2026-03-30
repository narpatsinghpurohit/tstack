import {
	type ArgumentMetadata,
	BadRequestException,
	Injectable,
	type PipeTransform,
} from "@nestjs/common";
import type { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
	constructor(private readonly schema: ZodSchema) {}

	transform(value: unknown, _metadata: ArgumentMetadata) {
		const result = this.schema.safeParse(value);

		if (!result.success) {
			const fieldErrors: Record<string, string[]> = {};
			for (const issue of result.error.issues) {
				const path = issue.path.join(".") || "_root";
				if (!fieldErrors[path]) {
					fieldErrors[path] = [];
				}
				fieldErrors[path].push(issue.message);
			}
			throw new BadRequestException({
				message: "Validation failed",
				errors: fieldErrors,
			});
		}

		return result.data;
	}
}
