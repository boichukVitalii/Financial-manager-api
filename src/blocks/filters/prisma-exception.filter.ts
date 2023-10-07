import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ExceptionResponseDto } from '../../common/dto/exception-response.dto';

const prismaExceptionsToHTTPStatusCodesMapper = {
	P2002: HttpStatus.CONFLICT,
	P2025: HttpStatus.NOT_FOUND,
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
	private readonly logger = new Logger(PrismaClientExceptionFilter.name);

	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
		this.logger.error(exception.message);

		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const message = exception.message.split('\n').pop();
		const status = prismaExceptionsToHTTPStatusCodesMapper[exception.code];

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
