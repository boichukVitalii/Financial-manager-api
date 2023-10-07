import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

const SortOrder = {
	asc: 'asc',
	desc: 'desc',
} as const;

export type TSortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export class PaymentQueryDto extends PartialType(PaginationQueryDto) {
	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	description?: string;

	@IsEnum(SortOrder, { message: 'orderBy paramater must be either `asc` or `desc`' })
	@IsOptional()
	@ApiProperty({ required: false, enum: SortOrder })
	orderByDate?: TSortOrder;
}
