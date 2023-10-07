import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { PaymentCategoryModule } from './payment-category/payment-category.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [PaymentModule, PaymentCategoryModule, PrismaModule],
})
export class AppModule {}
