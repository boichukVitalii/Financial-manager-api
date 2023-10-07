import { HttpStatus } from '@nestjs/common';

export class CustomError extends Error {
	constructor(
		public readonly message: string,
		public readonly httpStatusCode?: HttpStatus,
	) {
		super(message);
	}
}

export class NotEnoughFundsOperationError extends CustomError {
	constructor() {
		const message = 'You do not have enough funds for this operation!';
		super(message, HttpStatus.BAD_REQUEST);
	}
}
