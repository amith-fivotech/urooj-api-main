import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* app.enableCors();
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  ); */
  // app.use(csurf({ cookie: true }));
  // app.use(csurf({ cookie: { key: '_csrf', sameSite: true } }));
  await app.listen(3000);
}
bootstrap();
