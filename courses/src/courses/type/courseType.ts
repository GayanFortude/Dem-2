import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { IsNotEmpty,IsDefined } from 'class-validator';

@ObjectType()
@Directive('@key(fields: "code")')
export class Course {
  @Field()
  @IsNotEmpty({ message: 'Id cannot be empty' })
  @IsDefined({ message: 'Id is required' })
  id: string;
  @Field()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsDefined({ message: 'Name is required' })
  name: string;
  @IsNotEmpty({ message: 'Code cannot be empty' })
  @IsDefined({ message: 'Code is required' })
  @Field((type) => ID)
  code: string;
}
