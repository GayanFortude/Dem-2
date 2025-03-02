
import { InputType, Field,PartialType, ID } from '@nestjs/graphql';
import { CreateCourseInput } from './createCourseDto';
// import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
//   @IsNotEmpty({ message: 'Id cannot be empty' })
  @Field(() => ID)
  id: string;
}
