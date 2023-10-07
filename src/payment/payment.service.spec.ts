import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { NotEnoughFundsOperationError } from '../error/custom-errors';
import { PaymentLogger } from './utils/payment-logger.class';

describe('PaymentService Unit', () => {
	let service: PaymentService;
	let createMock: jest.Mock;
	const findUniqueOrThrowMock = jest.fn();
	const queryRawMock = jest.fn();
	const findManyMock = jest.fn();
	const updateMock = jest.fn();
	const deleteMock = jest.fn();

	beforeEach(async () => {
		createMock = jest.fn();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PaymentService,
				{
					provide: PaymentLogger,
					useValue: {
						write: jest.fn(),
					},
				},
				{
					provide: PrismaService,
					useValue: {
						$queryRaw: queryRawMock,
						payment: {
							create: createMock,
							findUniqueOrThrow: findUniqueOrThrowMock,
							findMany: findManyMock,
							update: updateMock,
							delete: deleteMock,
						},
					},
				},
			],
		}).compile();

		service = module.get<PaymentService>(PaymentService);
	});

	describe('when create is called', () => {
		describe('and the create method returns the payment', () => {
			let payment: Payment;
			let paymentDto: CreatePaymentDto;

			beforeEach(() => {
				paymentDto = {
					type: 'income',
					amount: 20,
					description: 'test1',
					categoryId: 'id1',
				};
				payment = {
					...paymentDto,
					id: 'id1',
					amount: new Prisma.Decimal(paymentDto.amount),
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				createMock.mockResolvedValue(payment);
			});

			it('should return the payment', async () => {
				const result = await service.create(paymentDto);
				expect(result).toBe(payment);
			});
		});

		describe('and the create method throws an error', () => {
			let paymentDto: CreatePaymentDto;

			beforeEach(() => {
				paymentDto = {
					type: 'expense',
					amount: 30,
					description: 'test2',
					categoryId: 'id1',
				};
				queryRawMock.mockResolvedValue([{ balance: 20 }]);
			});

			it('should throw a NotEnoughFundsOperationError error', async () => {
				try {
					await service.create(paymentDto);
				} catch (e) {
					expect(e).toBeInstanceOf(NotEnoughFundsOperationError);
				}
			});
		});
	});

	describe('when getCurrentBalance is called', () => {
		describe('and the method returns the balance', () => {
			beforeEach(() => {
				queryRawMock.mockResolvedValue([{ balance: 20 }]);
			});

			it('should return the balance', async () => {
				const result = await service.getCurrentBalance();
				expect(result).toBeCloseTo(20);
			});
		});
	});

	describe('when findOne is called', () => {
		const payment: Payment = {
			id: 'id1',
			type: 'income',
			description: 'test1',
			categoryId: 'id1',
			amount: new Prisma.Decimal(20),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		describe('and the findOne method returns the payment', () => {
			beforeEach(() => {
				findUniqueOrThrowMock.mockResolvedValue(payment);
			});

			it('should return the payment', async () => {
				const result = await service.findOne({ id: payment.id });
				expect(result).toBe(payment);
			});
		});

		describe('and the findOne method throws an error', () => {
			beforeEach(() => {
				findUniqueOrThrowMock.mockRejectedValue(
					new Prisma.PrismaClientKnownRequestError('Not found', {
						code: 'P2025',
						clientVersion: 'version',
					}),
				);
			});

			it('should throw a PrismaClient error', async () => {
				try {
					await service.findOne({ id: payment.id });
				} catch (e) {
					expect(e).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
				}
			});
		});
	});

	describe('when findAll is called', () => {
		const payment: Payment = {
			id: 'id1',
			type: 'income',
			description: 'test1',
			categoryId: 'id1',
			amount: new Prisma.Decimal(20),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		describe('and the findAll method returns all payments', () => {
			beforeEach(() => {
				findManyMock.mockResolvedValue([payment]);
			});

			it('should return all payments', async () => {
				const result = await service.findAll({});
				expect(result.length).toBe(1);
				expect(result[0]).toBe(payment);
			});
		});
	});

	describe('when update is called', () => {
		const payment: Payment = {
			id: 'id1',
			type: 'income',
			description: 'test1',
			categoryId: 'id1',
			amount: new Prisma.Decimal(20),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		describe('and the update method returns an updated payment', () => {
			beforeEach(() => {
				updateMock.mockImplementation(
					(params: { where: Prisma.PaymentWhereUniqueInput; data: Prisma.PaymentUpdateInput }) =>
						Promise.resolve({ ...payment, description: params.data.description }),
				);
			});

			it('should return an updated payment', async () => {
				const params = { where: { id: payment.id }, data: { description: 'updatedDesc' } };
				const result = await service.update(params);
				expect(result).toStrictEqual({ ...payment, description: 'updatedDesc' });
			});
		});
	});

	describe('when remove is called', () => {
		const payment: Payment = {
			id: 'id1',
			type: 'income',
			description: 'test1',
			categoryId: 'id1',
			amount: new Prisma.Decimal(20),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		describe('and the remove method returns removed payment', () => {
			beforeEach(() => {
				deleteMock.mockResolvedValue(payment);
			});

			it('should return removed payment', async () => {
				const result = await service.remove({ id: payment.id });
				expect(result).toBe(payment);
			});
		});
	});
});
