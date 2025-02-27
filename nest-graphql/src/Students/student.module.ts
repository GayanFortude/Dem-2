import { Module } from '@nestjs/common';
import { StudentResolver } from './students.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentService } from './student.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { GraphqlResponseInterceptor } from 'src/common/response.interceptor';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ExcelService } from 'src/queue/excel.service';
import { ExcelModule } from 'src/queue/excel.module';
import { BullModule } from '@nestjs/bull';
import { SharedModule } from 'src/common/sharedmodule';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
  KafkaModule,
  SharedModule,
  TypeOrmModule.forFeature([Student]),
  GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    driver: ApolloFederationDriver,
    autoSchemaFile: {
      federation: 2,
    },
    playground:true,
    introspection:true
  }),
],
  controllers:[],
  providers: [StudentResolver, GraphqlResponseInterceptor],
})
export class StudentModule {}
