import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { CustomError } from '../../error/custom-errors';
import { ExceptionResponseDto } from '../../common/dto/exception-response.dto';

@Catch(CustomError)
export class CustomExceptionFilter extends BaseExceptionFilter {
	private readonly logger = new Logger(CustomExceptionFilter.name);

	catch(exception: CustomError, host: ArgumentsHost): void {
		this.logger.error(exception.message);

		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const message = exception.message;
		const status = exception.httpStatusCode || 500;

		if (status) {
			response.status(status).json({
				statusCode: status,
				message: message,
			} as ExceptionResponseDto);
		} else {
			super.catch(exception, host);
		}
	}
}
