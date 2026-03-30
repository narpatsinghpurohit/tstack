import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const requestId =
			(request.headers["x-request-id"] as string) ?? uuidv4();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Internal server error";
		let error = "InternalServerError";
		let errors: Record<string, string[]> | undefined;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === "string") {
				message = exceptionResponse;
			} else if (typeof exceptionResponse === "object") {
				const resp = exceptionResponse as Record<string, unknown>;
				message = (resp.message as string) ?? exception.message;
				error = (resp.error as string) ?? exception.name;
				errors = resp.errors as Record<string, string[]> | undefined;
			}
		} else {
			this.logger.error(
				`Unhandled exception: ${exception instanceof Error ? exception.message : String(exception)}`,
				exception instanceof Error ? exception.stack : undefined,
			);
		}

		response.status(status).json({
			statusCode: status,
			message,
			error,
			...(errors ? { errors } : {}),
			timestamp: new Date().toISOString(),
			path: request.url,
			requestId,
		});
	}
}
