import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { PaymentEntity } from './entities/payment.entity';
import { CurrentBalanceDto } from './dto/current-balance.dto';
import { PaymentQueryDto } from './dto/payment-query.dto';
import { ExceptionResponseDto } from '../common/dto/exception-response.dto';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post()
	@ApiBadRequestResponse({ type: ExceptionResponseDto })
	@ApiCreatedResponse({ type: PaymentEntity })
	async create(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
		return await this.paymentService.create(createPaymentDto);
	}

	@Get('balance')
	@ApiOkResponse({ type: CurrentBalanceDto })
	async getCurrentBalance(): Promise<CurrentBalanceDto> {
		const balance = await this.paymentService.getCurrentBalance();
		return { currentBalance: balance };
	}

	@Get()
	@ApiOkResponse({ type: PaymentEntity, isArray: true })
	async findAll(@Query() paymentQuery: PaymentQueryDto): Promise<PaymentEntity[]> {
		const { skip, take, description, orderByDate } = paymentQuery;
		return await this.paymentService.findAll({
			skip,
			take,
			where: { description: { contains: description } },
			orderBy: { createdAt: orderByDate },
		});
	}

	@Get(':id')
	@ApiNotFoundResponse({ type: ExceptionResponseDto })
	@ApiOkResponse({ type: PaymentEntity })
	async findOne(@Param('id') id: string): Promise<PaymentEntity> {
		return await this.paymentService.findOne({ id });
	}

	@Patch(':id')
	@ApiBadRequestResponse({ type: ExceptionResponseDto })
	@ApiOkResponse({ type: PaymentEntity })
	async update(
		@Param('id') id: string,
		@Body() updatePaymentDto: UpdatePaymentDto,
	): Promise<PaymentEntity> {
		return await this.paymentService.update({ where: { id }, data: updatePaymentDto });
	}

	@Delete(':id')
	@ApiOkResponse({ type: PaymentEntity })
	async remove(@Param('id') id: string): Promise<PaymentEntity> {
		return await this.paymentService.remove({ id });
	}
}
