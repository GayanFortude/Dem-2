import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Student } from '../entities/student.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Course {
  @Field((type) => ID)
  @Directive('@external')
  id: string;

  @Field((type) => [Student])
  student: Student[];
}