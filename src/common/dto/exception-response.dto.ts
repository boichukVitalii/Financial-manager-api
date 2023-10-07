import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResponseDto {
	@ApiProperty({ enum: HttpStatus, example: 500 })
	statusCode: HttpStatus;
	@ApiProperty({ example: 'Something went wrong' })
	message: string;

	constructor(response: { statusCode: HttpStatus; message: string }) {
		Object.assign(this, response);
	}
}
