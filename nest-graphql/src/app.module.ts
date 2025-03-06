import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Student } from './Students/entities/student.entity';
import { StudentModule } from './Students/student.module';
import { KafkaModule } from './kafka/kafka.module';
import { ExcelModule } from './queue/excel.module';


@Module({
  imports: [StudentModule,KafkaModule,ExcelModule,
    TypeOrmModule.forFeature([Student]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'postgres',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
