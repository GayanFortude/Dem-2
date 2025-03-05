import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "code")')
export class Course {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field((type) => ID)
  code: string;
}
