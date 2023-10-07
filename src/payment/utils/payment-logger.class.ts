import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { appendFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type TPaymentOperation = 'create' | 'update' | 'remove';

@Injectable()
export class PaymentLogger {
	private readonly logsDirPath: string = join(process.cwd(), 'logs');
	private readonly logsFilePath: string = join(this.logsDirPath, 'payment.log');

	constructor() {
		mkdirSync(this.logsDirPath, { recursive: true });
	}

	async write(
		operation: TPaymentOperation,
		{ type, amount, categoryId, createdAt }: Payment,
	): Promise<void> {
		const paymentLogData =
			JSON.stringify({
				operation,
				type,
				amount,
				categoryId,
				createdAt,
			}) + '\n';
		await appendFile(this.logsFilePath, paymentLogData, 'utf-8');
	}
}
