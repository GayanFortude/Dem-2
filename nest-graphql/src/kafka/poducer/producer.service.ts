import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
  async onModuleInit() {
    await this.producer.connect();
  }
  private readonly kafka = new Kafka({
    clientId: 'kafkajs',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
    retry: {
      initialRetryTime: 300, 
      retries: 10,           
    },
    connectionTimeout: 10000, 
    requestTimeout: 25000,    
  });

  private readonly producer: Producer = this.kafka.producer();

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }
}