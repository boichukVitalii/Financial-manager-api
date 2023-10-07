import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';

export const PaymentType = {
	income: 'income',
	expense: 'expense',
} as const;

export type TPaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export class CreatePaymentDto {
	@IsEnum(PaymentType)
	@ApiProperty({ enum: PaymentType })
	type: TPaymentType;

	@IsPositive()
	@ApiProperty()
	amount: number;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	description: string;

	@IsUUID()
	@ApiProperty()
	categoryId: string;
}
