import { Injectable } from '@nestjs/common';
import { PaymentCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentCategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async create(categoryData: Prisma.PaymentCategoryCreateInput): Promise<PaymentCategory> {
		return await this.prisma.paymentCategory.create({ data: categoryData });
	}

	async findAll(): Promise<PaymentCategory[]> {
		return await this.prisma.paymentCategory.findMany();
	}

	async findOne(where: Prisma.PaymentCategoryWhereUniqueInput): Promise<PaymentCategory> {
		return await this.prisma.paymentCategory.findUniqueOrThrow({ where });
	}

	async update(params: {
		where: Prisma.PaymentCategoryWhereUniqueInput;
		data: Prisma.PaymentCategoryUpdateInput;
	}): Promise<PaymentCategory> {
		return await this.prisma.paymentCategory.update(params);
	}

	async remove(where: Prisma.PaymentCategoryWhereUniqueInput): Promise<PaymentCategory> {
		return await this.prisma.paymentCategory.delete({ where });
	}
}
