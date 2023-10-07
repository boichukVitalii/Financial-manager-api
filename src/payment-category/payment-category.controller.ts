import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentCategoryService } from './payment-category.service';
import { CreatePaymentCategoryDto } from './dto/create-payment-category.dto';
import { UpdatePaymentCategoryDto } from './dto/update-payment-category.dto';
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { PaymentCategoryEntity } from './entities/payment-category.entity';
import { ExceptionResponseDto } from '../common/dto/exception-response.dto';

@Controller('payment-category')
@ApiTags('payment-category')
export class PaymentCategoryController {
	constructor(private readonly paymentCategoryService: PaymentCategoryService) {}

	@Post()
	@ApiBadRequestResponse({ type: ExceptionResponseDto })
	@ApiConflictResponse({ type: ExceptionResponseDto })
	@ApiCreatedResponse({ type: PaymentCategoryEntity })
	async create(
		@Body() createPaymentCategoryDto: CreatePaymentCategoryDto,
	): Promise<PaymentCategoryEntity> {
		return await this.paymentCategoryService.create(createPaymentCategoryDto);
	}

	@Get()
	@ApiOkResponse({ type: PaymentCategoryEntity, isArray: true })
	async findAll(): Promise<PaymentCategoryEntity[]> {
		return await this.paymentCategoryService.findAll();
	}

	@Get(':id')
	@ApiNotFoundResponse({ type: ExceptionResponseDto })
	@ApiOkResponse({ type: PaymentCategoryEntity })
	async findOne(@Param('id') id: string): Promise<PaymentCategoryEntity> {
		return await this.paymentCategoryService.findOne({ id });
	}

	@Patch(':id')
	@ApiBadRequestResponse({ type: ExceptionResponseDto })
	@ApiConflictResponse({ type: ExceptionResponseDto })
	@ApiOkResponse({ type: PaymentCategoryEntity })
	async update(
		@Param('id') id: string,
		@Body() updatePaymentCatDto: UpdatePaymentCategoryDto,
	): Promise<PaymentCategoryEntity> {
		return await this.paymentCategoryService.update({ where: { id }, data: updatePaymentCatDto });
	}

	@Delete(':id')
	@ApiOkResponse({ type: PaymentCategoryEntity })
	async remove(@Param('id') id: string): Promise<PaymentCategoryEntity> {
		return await this.paymentCategoryService.remove({ id });
	}
}
