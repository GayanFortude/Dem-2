import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config({ path: join(__dirname,'..', '.env') });
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
