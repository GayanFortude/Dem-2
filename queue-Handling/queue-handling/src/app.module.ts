import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExcelController } from './queue/excel.controller';
import { ExcelService } from './queue/excel.service';
import { BullModule as NestBullModule } from '@nestjs/bull';
import { ExcelProcessor } from './queue/excel.processor';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    KafkaModule,
    NestBullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),
    NestBullModule.registerQueue({ name: 'studentqueue' }),
  ],
  controllers: [ExcelController],
  providers: [ExcelService, ExcelProcessor],
})
export class AppModule {}
