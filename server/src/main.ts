import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedApp: any;

async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('API documentation for user authentication system using cookies')
    .setVersion('1.0')
    .addCookieAuth('auth-cookie', {
      type: 'apiKey',
      in: 'cookie',
      name: 'auth-cookie',
      description: 'Authentication cookie for user sessions',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

// For Vercel serverless functions
export default async function handler(req: any, res: any) {
  const app = await createApp();
  return app(req, res);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await createApp();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Application is running on port:${port}`);
    });
  }
  bootstrap();
}
