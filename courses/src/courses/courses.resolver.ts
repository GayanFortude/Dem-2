import { Resolver, Query, Mutation, Args, Int, ResolveReference, ResolveField, Parent } from '@nestjs/graphql';
import { BadRequestException, HttpStatus, InternalServerErrorException, Res} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseInput } from './dto/createCourseDto';

import { Course } from './type/courseType';
import { UpdateCourseInput } from './dto/updateCourseInput';

@Resolver(() => Course)

export class CourseResolver {
  constructor(
    private readonly courseService: CourseService
  ) { }




  @Query(() => [Course])
  async getCourses(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number
  ): Promise<Course[]> {
    return this.courseService.getCourses(limit,offset); // Fetch all courses
  }


  @Query(() => [Course])
  async getAllCourses(
  ): Promise<Course[]> {
    return this.courseService.getAllCourses(); // Fetch all courses
  }


  @Query(() => Course, { nullable: true })
  async course1(@Args('id', { type: () => String }) id: string): Promise<Course> {
    console.log("s") 
    return this.courseService.getCourseId(id); // Assuming this exists in your service
  }


  @Mutation(() => Course)
  async createCourse(@Args('input') input: CreateCourseInput) {
    return this.courseService.create(input);
  }


  @Mutation(() => Course) //Update user
  async updateCourse(
    @Args('UpdateCourseInput') updateCourseInput: UpdateCourseInput,
  ): Promise<Course | null> {
    try {
      return this.courseService.update(
        updateCourseInput.id,
        updateCourseInput,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

 
  @ResolveReference()
  resolvereferance(ref: { __typename: string, id: string }) {
    console.log("ss",ref.id)
    return this.courseService.findById(ref.id);
  }


}
