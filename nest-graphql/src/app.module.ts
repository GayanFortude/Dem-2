import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Student } from './Students/entities/student.entity';
import { StudentModule } from './Students/student.module';
import { StudentService } from './Students/student.service';
import { ExcelController } from './queue/excel.controller';
import { KafkaModule } from './kafka/kafka.module';
import { ExcelService } from './queue/excel.service';
import { ExcelProcessor } from './queue/excel.processor';
import { ExcelModule } from './queue/excel.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SharedModule } from './common/sharedmodule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Course } from './Students/dto/courseDto';
//host.docker.internal
@Module({
  imports: [StudentModule,KafkaModule,ExcelModule,
    TypeOrmModule.forFeature([Student]),
    // GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    //   driver: ApolloFederationDriver,
    //   autoSchemaFile: {
    //     federation: 2,
    //   },
    //   playground:true,
    //   introspection:true,
    //   buildSchemaOptions: {
    //     orphanedTypes: [Course],
    //   },
    // }),
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
