import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@extends') 
@Directive('@key(fields: "id")')
export class Student {
  @Field(() => ID)
  @Directive('@external')
  id: string;

  @Directive('@external')
  fname: string;
  @Directive('@external')
  lname: string;
}
