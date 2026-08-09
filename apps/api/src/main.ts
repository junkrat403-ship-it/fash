import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Trust reverse proxy headers (Render, Cloudflare, Nginx)
  const instance = app.getHttpAdapter().getInstance();
  if (instance && typeof instance.set === 'function') {
    instance.set('trust proxy', true);
  }

  // Allowed Origins for CORS
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    process.env.STOREFRONT_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean) as string[];

  // Production & Development CORS Handler
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean | string) => void) => {
      // Allow non-browser requests (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      // Check against explicit allowed origins list or pattern match (Render apps, Dev Tunnels, localhost)
      const isAllowedDomain =
        allowedOrigins.some((allowed) => origin.startsWith(allowed) || allowed === origin) ||
        /(\.onrender\.com|\.devtunnels\.ms|\.ngrok-free\.app|\.loca\.lt|\.trycloudflare\.com)(:\d+)?$/.test(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1');

      if (isAllowedDomain || process.env.NODE_ENV !== 'production') {
        callback(null, origin);
      } else {
        callback(null, origin);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Guest-Token'],
  });

  // Cookie Parser
  app.use(cookieParser());

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Fashion E-Commerce API')
    .setDescription('REST API contract for storefront and admin panel')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`API is running on port: ${port}`);
  console.log(`Swagger Docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
