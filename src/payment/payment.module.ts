import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentLogger } from './utils/payment-logger.class';

@Module({
	controllers: [PaymentController],
	providers: [PaymentService, PaymentLogger],
	imports: [PrismaModule],
})
export class PaymentModule {}
