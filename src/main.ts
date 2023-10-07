import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './blocks/filters/prisma-exception.filter';
import { CustomExceptionFilter } from './blocks/filters/custom-exception.filter';

const validationPipeOptions: ValidationPipeOptions = {
	whitelist: true,
	transform: true,
	forbidNonWhitelisted: true,
	stopAtFirstError: true,
};

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(
		new CustomExceptionFilter(httpAdapter),
		new PrismaClientExceptionFilter(httpAdapter),
	);

	const options = new DocumentBuilder()
		.setTitle('Financial manager')
		.setDescription('Nikcode financial manager api')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document);

	app.enableShutdownHooks();
	await app.listen(process.env.HTTP_PORT || 3000);
}
bootstrap();
