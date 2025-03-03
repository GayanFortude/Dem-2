import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (requestOrigin, callback) => {
      callback(null, requestOrigin || '*');
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, 
  })

  await app.startAllMicroservices();
  app.use(require('body-parser').urlencoded({ extended: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
