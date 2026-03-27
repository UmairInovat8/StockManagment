import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Temporary diagnostic logging
const logFile = path.join(__dirname, '..', 'api-debug.log');
process.on('uncaughtException', (err) => {
  fs.appendFileSync(logFile, `[UncaughtException] ${new Date().toISOString()}: ${err.stack || err.message}\n`);
});
process.on('unhandledRejection', (reason, promise) => {
  fs.appendFileSync(logFile, `[UnhandledRejection] ${new Date().toISOString()}: ${reason}\n`);
});

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
class DebugExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const logMessage = `[Route ${request.method} ${request.url}] Status: ${status} | Error: ${exception.stack || exception.message || exception}\n`;
    fs.appendFileSync(logFile, `[ExceptionFilter] ${new Date().toISOString()}: ${logMessage}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal server error',
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new DebugExceptionFilter());
  
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: false 
  }));

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
