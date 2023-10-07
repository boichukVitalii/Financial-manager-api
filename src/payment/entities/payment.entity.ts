import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Payment } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class PaymentEntity implements Payment {
	@ApiProperty()
	id: string;

	@ApiProperty({ enum: $Enums.PaymentType })
	type: $Enums.PaymentType;

	@ApiProperty()
	amount: Decimal;

	@ApiProperty()
	description: string;

	@ApiProperty()
	categoryId: string | null;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
