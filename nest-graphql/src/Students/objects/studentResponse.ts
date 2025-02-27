import { Field, ObjectType } from '@nestjs/graphql';
import { Student } from '../entities/student.entity';
import { PaginationObject } from './paginationObject';

@ObjectType()
export class StudentResponse {
  @Field((type) => [Student])
  student: Student[];

  @Field()
  paginationObject: PaginationObject;
}
