/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PortugueseValidationPipe } from './common/validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cuida do Pipe de validações
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos não declarados no DTO
      forbidNonWhitelisted: true, // Rejeita requisições com campos extras
      transform: true, // Converte tipos automaticamente
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  // Configuração do CORS
  app.enableCors({
    origin: 'http://localhost:4200', // URL exata do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Todos métodos necessários
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  const server = app.getHttpServer();
  const router = server._events.request._router;
  console.log(router.stack.map(layer => layer?.route?.path));  
}

bootstrap();
