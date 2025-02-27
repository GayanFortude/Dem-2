import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsDateString, IsDefined } from 'class-validator';

@InputType()
export class CreateStudentInputDto {
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsDefined({ message: 'First name is required' })
  fname: string;

  @Field({ nullable: true })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsDefined({ message: 'Last name is required' })
  lname: string;

  @Field({ nullable: true })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsDefined({ message: 'Email is required' })
  email: string;

  @Field({ nullable: true })
  @IsDateString({}, { message: 'Invalid date format. Expected YYYY-MM-DD' })
  @IsDefined({ message: 'Date is required' })
  dob: string;
}
