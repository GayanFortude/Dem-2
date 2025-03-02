// import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
// import { Course } from '../type/courseType';

// @ObjectType()
// @Directive('@extends') 
// @Directive('@key(fields: "id")')
// export class Student {
//   @Field(() => ID)
//   @Directive('@external')
//   id: string;

//   @Field()
//   @Directive('@external') // This field exists in another service
//   fname: string;

//   @Field()
//   @Directive('@external')
//   courseId: string; 

//   // @Field(() => CourseType, { nullable: true })
//   // course?: CourseType; // Resolved back to this servic

//   // @Directive('@external')
//   // fname: string;
//   // @Directive('@external')
//   // lname: string;
// }
