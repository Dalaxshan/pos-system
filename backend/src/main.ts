import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { json } from 'body-parser';
import { CombinedExceptionFilter } from './exception-filters/combined-exception-filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  app.setGlobalPrefix('/api/v1');

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Maki Suite API')
    .setDescription('Maki Suite API')
    .setVersion('1.0')
    .addTag('maki-suite')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('reference', app, document);

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false, //set to true when going live
    }),
  );

  // Global Interceptors and Filters
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new CombinedExceptionFilter());

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://thewebsushi.com',
      'http://maki-pos.thewebsushi.com',
      'https://maki-pos.thewebsushi.com',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  });
  app.use(json({ limit: '50mb' }));

  await app.listen(process.env.PORT);
  Logger.log(`Server running on http://localhost:${process.env.PORT}`, 'Bootstrap');
}
bootstrap();
