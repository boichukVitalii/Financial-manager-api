import { ApiProperty } from '@nestjs/swagger';
import { PaymentCategory } from '@prisma/client';

export class PaymentCategoryEntity implements PaymentCategory {
	@ApiProperty()
	id: string;

	@ApiProperty()
	title: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
