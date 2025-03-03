
import { InputType, Field,PartialType, ID } from '@nestjs/graphql';
import { CreateCourseInput } from './createCourseDto';


@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field(() => ID)
  id: string;
}
