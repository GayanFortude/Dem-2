import { ObjectType, Field,ID, Directive } from '@nestjs/graphql';
import { Student } from '../dto/studentDto';


@ObjectType()
@Directive('@key(fields: "id")')
export class CourseType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  studentId: string; 

  @Field(() => Student, { nullable: true })
  student?: Student;

}
