import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { map, type Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";

export interface ApiResponse<T> {
	data: T;
	status: number;
	message: string;
	requestId: string;
}

@Injectable()
export class ResponseInterceptor<T>
	implements NestInterceptor<T, ApiResponse<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler<T>,
	): Observable<ApiResponse<T>> {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();
		const requestId = (request.headers["x-request-id"] as string) ?? uuidv4();

		return next.handle().pipe(
			map((data) => ({
				data,
				status: response.statusCode,
				message: "Success",
				requestId,
			})),
		);
	}
}
