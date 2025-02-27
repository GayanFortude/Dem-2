
import { InputType, Field,PartialType, ID } from '@nestjs/graphql';
import { CreateStudentInputDto } from './CreateStudentInputDto';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateStudentInput extends PartialType(CreateStudentInputDto) {
  @IsNotEmpty({ message: 'Id cannot be empty' })
  @Field(() => ID)
  id: string;
}
