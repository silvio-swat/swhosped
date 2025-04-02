/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cuida do Pipe de validações
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos não declarados no DTO
      forbidNonWhitelisted: false, // Rejeita requisições com campos extras
      transform: true, // Converte tipos automaticamente
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  // Configuração do CORS
  app.enableCors({
    //origin: 'http://localhost:4200', // URL exata do frontend
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://192.168.68.73:4200',
        'http://192.168.68.74:4200',
        'http://192.168.68.75:4200',
        'http://192.168.68.77:4200',
        'http://192.168.68.52:4200',        
        'http://127.0.0.1:4200',
        'http://localhost:4200'
      ];
  
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Permite a requisição
      } else {
        callback(new Error('Acesso bloqueado por CORS')); // Bloqueia
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH','OPTIONS', 'HEAD'], // Todos métodos necessários
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  // const server = app.getHttpServer();
  // const router = server._events.request._router;
  // console.log(router.stack.map(layer => layer?.route?.path));  
}

bootstrap();
