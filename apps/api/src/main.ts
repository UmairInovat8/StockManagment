import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bodyParser = require('body-parser');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use((req: any, res: any, next: any) => {
    res.on('finish', () => {
      console.log(`[HTTP] ${req.method} ${req.url} -> ${res.statusCode}`);
    });
    next();
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
