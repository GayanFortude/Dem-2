import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { BullModule } from '@nestjs/bull';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from './kafka/kafka.module';
import { ConsumerService } from './kafka/consumer/consumer.service';
import { SocketModule } from './shocket/socket.module';
@Module({
  imports: [
    SocketModule,
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'excelQueue',
    }),
  ], 
  controllers: [],
  providers: [],
})
export class AppModule {}
