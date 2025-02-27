import { Module } from '@nestjs/common';
import { ProducerService } from './poducer/producer.service';


@Module({
  imports:[KafkaModule],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class KafkaModule {}