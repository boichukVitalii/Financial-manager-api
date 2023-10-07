import { ApiProperty } from '@nestjs/swagger';

export class CurrentBalanceDto {
	@ApiProperty()
	currentBalance: number;
}
