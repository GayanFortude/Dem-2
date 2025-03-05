import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
} from '@nestjs/graphql';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseInput } from './dto/createCourseDto';
import { Course } from './type/courseType';
import { UpdateCourseInput } from './dto/updateCourseInput';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(() => [Course])
  async getCourses(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<Course[]> {
    try {
      return this.courseService.getCourses(limit, offset); // Fetch all courses
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Query(() => [Course])
  async getAllCourses(): Promise<Course[]> {
    try {
      return this.courseService.getAllCourses(); // Fetch all courses
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Query(() => Course, { nullable: true })
  async course(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Course> {
    try {
      return this.courseService.getCourseId(id); 
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Mutation(() => Course)
  async createCourse(@Args('input') input: CreateCourseInput) {
    try {
      console.log(input)
      return this.courseService.create(input);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Mutation(() => Course) //Update user
  async updateCourse(
    @Args('UpdateCourseInput') updateCourseInput: UpdateCourseInput,
  ): Promise<Course | null> {
    try {
      return this.courseService.update(updateCourseInput.id, updateCourseInput);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @ResolveReference()
  resolvereferance(ref: { __typename: string; code: string }) {
    return this.courseService.findById(ref.code);
  }
}
