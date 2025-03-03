import { ObjectType, Field,ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Course {
  @Field((type) => ID)
  id: string;
  @Field()
  name: string;
}
