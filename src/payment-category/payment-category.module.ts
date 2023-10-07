import { Module } from '@nestjs/common';
import { PaymentCategoryService } from './payment-category.service';
import { PaymentCategoryController } from './payment-category.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	controllers: [PaymentCategoryController],
	providers: [PaymentCategoryService],
	imports: [PrismaModule],
})
export class PaymentCategoryModule {}
