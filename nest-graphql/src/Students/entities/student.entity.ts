import { ObjectType, Field,ID, Directive, Int } from '@nestjs/graphql';
import { Column, Entity,  PrimaryGeneratedColumn } from 'typeorm';
import { Course } from '../dto/courseDto';

@Entity()
@ObjectType()
@Directive('@key(fields: "id")')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column()
  @Field()
  fname: string;
  @Column()
  @Field()
  lname: string;
  @Column()
  @Field()
  email: string;
  @Column()
  @Field()
  dob: Date;
  @Field()
  age:number;
  @Column()
  @Field()
  courseID: string;
  @Field(() => Course, { nullable: true })
  course?: Course;

}



