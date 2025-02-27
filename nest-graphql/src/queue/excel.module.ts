import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelService } from 'src/queue/excel.service';
import { ExcelController } from './excel.controller';
import { ExcelProcessor } from './excel.processor';
import { Student } from 'src/Students/entities/student.entity';
import { StudentModule } from 'src/Students/student.module';
import { StudentService } from 'src/Students/student.service';
import { BullModule } from '@nestjs/bull';
import { KafkaModule } from 'src/kafka/kafka.module';
import { SharedModule } from 'src/common/sharedmodule';
import { FileEntity } from 'src/Students/entities/file.entity';

@Module({
  imports: [
    SharedModule,
  ],
  controllers: [ExcelController],
  providers: [ExcelProcessor],
})
export class ExcelModule {}
