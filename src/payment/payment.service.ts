import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';
import { PaymentLogger } from './utils/payment-logger.class';
import { PaymentType } from './dto/create-payment.dto';
import { NotEnoughFundsOperationError } from '../error/custom-errors';

@Injectable()
export class PaymentService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paymentLogger: PaymentLogger,
	) {}

	async create(paymentData: Prisma.PaymentCreateInput): Promise<Payment> {
		if (paymentData.type === PaymentType.expense) {
			const balance = await this.getCurrentBalance();
			if (new Prisma.Decimal(balance) < paymentData.amount) {
				throw new NotEnoughFundsOperationError();
			}
		}
		const payment = await this.prisma.payment.create({ data: paymentData });
		await this.paymentLogger.write('create', payment);
		return payment;
	}

	async getCurrentBalance(): Promise<number> {
		const result: [{ balance: number }] = await this.prisma.$queryRaw`
		   SELECT (
	        (SELECT 
            CASE 
              WHEN count(id) = 0 THEN 0 
              ELSE sum(amount) 
              END 
           FROM "public"."Payment" WHERE type = 'income')
	          -
	        (SELECT 
            CASE 
              WHEN count(id) = 0 THEN 0 
              ELSE sum(amount) 
              END 
           FROM "public"."Payment" WHERE type = 'expense')
    ) AS balance`;
		return result[0].balance;
	}

	async findAll(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.PaymentWhereUniqueInput;
		where?: Prisma.PaymentWhereInput;
		orderBy?: Prisma.PaymentOrderByWithRelationInput;
	}): Promise<Payment[]> {
		return await this.prisma.payment.findMany(params);
	}

	async findOne(where: Prisma.PaymentWhereUniqueInput): Promise<Payment> {
		return await this.prisma.payment.findUniqueOrThrow({ where });
	}

	async update(params: {
		where: Prisma.PaymentWhereUniqueInput;
		data: Prisma.PaymentUpdateInput;
	}): Promise<Payment> {
		const payment = await this.prisma.payment.update(params);
		await this.paymentLogger.write('update', payment);
		return payment;
	}

	async remove(where: Prisma.PaymentWhereUniqueInput): Promise<Payment> {
		const payment = await this.prisma.payment.delete({ where });
		await this.paymentLogger.write('remove', payment);
		return payment;
	}
}
