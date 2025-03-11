import { Module } from '@nestjs/common';
import { CourseResolver } from './courses.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { CourseService } from './course.service';


@Module({
  controllers:[],
  imports:[
    TypeOrmModule.forFeature([Course]),
     GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      playground:true,
      introspection:true
    }),
  ],
  providers: [CourseResolver,CourseService],
  exports:[]
})
export class CourseModule {}
