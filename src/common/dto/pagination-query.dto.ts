import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
	@IsPositive()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ required: false })
	skip?: number;

	@IsPositive()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ required: false })
	take?: number;
}
