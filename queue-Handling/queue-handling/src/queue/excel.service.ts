import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as xlsx from 'xlsx';
// import { ClientKafka } from '@nestjs/microservices';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
// import { Workbook } from 'exceljs';

@Injectable()
export class ExcelService implements OnModuleInit {
  constructor(
    @InjectQueue('studentqueue') private readonly studentqueue: Queue,
    private readonly _consumer: ConsumerService,
    // @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this._consumer.consume(
      'create-client',
      { topic: 'create-employee' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            source: 'create-consumer',
            message: message.value?.toString() ?? 'No File',
            partition: partition.toString(),
            topic: topic.toString(),
          });
          this.processExcel(message.value?.toString() ?? 'No message value');
        },
      },
    );
  }

  async processExcel(filePath: string) {
    if (filePath != 'No File') {
      await this.studentqueue.add(
        'read-excel',
        { filePath },
        {
          attempts: 3,
          backoff: 5000,
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
    }
  }
}
