import { Module } from '@nestjs/common';
import { StudentResolver } from './students.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { GraphqlResponseInterceptor } from 'src/common/response.interceptor';
import { KafkaModule } from 'src/kafka/kafka.module';
import { SharedModule } from 'src/common/sharedmodule';
import { Course } from './dto/courseDto';
import { CourseResolver } from './course.resolver';


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
    introspection:true,
    buildSchemaOptions: {
      orphanedTypes: [Course],
    },
  }),
],
  controllers:[],
  providers: [StudentResolver, GraphqlResponseInterceptor,CourseResolver],
})
export class StudentModule {}
