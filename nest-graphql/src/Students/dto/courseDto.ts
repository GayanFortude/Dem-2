import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Student } from '../entities/student.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "code")')
export class Course {
  @Field((type) => ID)
  @Directive('@external')
  code: string;
  @Field((type) => [Student])
  student?: Student[];
}