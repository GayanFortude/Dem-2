import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphqlResponseInterceptor } from './common/response.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  app.enableCors({
    origin: (requestOrigin, callback) => {
      callback(null, requestOrigin || '*');
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow cookies to be sent
  })

  await app.startAllMicroservices();
  app.use(require('body-parser').urlencoded({ extended: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
