import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';


@ObjectType()
@Entity()
export class Course {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  // @Field()
  // @Column()
  // studentId: string; 

  // @Field(() => Student, { nullable: true })
  // student?: Student;

}


