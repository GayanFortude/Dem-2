import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as crypto from 'crypto';

import { CourseModule } from './courses/course.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig, ApolloFederationDriver, ApolloFederationDriverConfigFactory } from '@nestjs/apollo';
import { join } from 'path';
import { Course } from './courses/type/courseType';
import {Course as CourseEntity } from './courses/entities/course';
const encryptedSecrets = {
  username: "20162041fe346d0d09b5a5d9e50d3daf",
  password: "8e9727d4411788f0c2b363d8e0b436d3",
  database: "20162041fe346d0d09b5a5d9e50d3daf"
};

const ENCRYPTION_KEY = '123455431qwertgfdswertyuiopkmn12'; 
const IV = '1234567890123456'; 


function decrypt(encrypted: string): string {
  console.log(process.env.ENCRYPTION_KEY)
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
//
@Module({
  imports: [
    CourseModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
    //   // Federation-specific settings
    //   buildSchemaOptions: {
    //     // Enable Federation 2 features
    //     orphanedTypes: [], // Add types if needed
    //   },
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: decrypt(encryptedSecrets.username),
      password: decrypt(encryptedSecrets.password),
      database: decrypt(encryptedSecrets.database),
      entities: [CourseEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
