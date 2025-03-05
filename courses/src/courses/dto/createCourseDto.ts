import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCourseInput {
  @Field()
  name: string;
  @Field()
  code: string;
}