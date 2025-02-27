import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from '../Students/student.service'; 
import { ExcelService } from '../queue/excel.service';
import { Student } from '../Students/entities/student.entity'; 
import { KafkaModule } from 'src/kafka/kafka.module';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { FileEntity } from 'src/Students/entities/file.entity';

@Module({
  imports: [
    KafkaModule,
    HttpModule,
    BullModule.registerQueue({
      name: 'studentqueue',
    }),
    TypeOrmModule.forFeature([Student]), 
    TypeOrmModule.forFeature([FileEntity]),
  ],
  providers: [StudentService, ExcelService],
  exports: [StudentService, ExcelService], 
})
export class SharedModule {}
