import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from '../Students/student.service'; 
import { ExcelService } from '../queue/excel.service';
import { Student } from '../Students/entities/student.entity'; 
import { KafkaModule } from 'src/kafka/kafka.module';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { FileEntity } from 'src/Students/entities/file.entity';
import { CacheService } from 'src/cache/cache.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [

    KafkaModule,
    HttpModule,
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: '127.0.0.1',
        port: 6379,
        password: '123456',
      }
    }),
    BullModule.registerQueue({
      name: 'studentqueue',
    }),
    TypeOrmModule.forFeature([Student]), 
    TypeOrmModule.forFeature([FileEntity]),
  ],
  providers: [StudentService, ExcelService,CacheService],
  exports: [StudentService, ExcelService,CacheService], 
})
export class SharedModule {}
