import { Resolver, Query, Mutation, Args, Int, ResolveReference, ResolveField, Parent } from '@nestjs/graphql';
import { BadRequestException, HttpStatus, InternalServerErrorException, Res} from '@nestjs/common';
import { Course } from './entities/course';
import { CourseService } from './course.service';
import { CreateCourseInput } from './dto/createCourseDto';
import { Student } from './dto/studentDto';

@Resolver(() => Course)

export class CourseResolver {
  constructor(
    private readonly courseService: CourseService
  ) { }


  @Query(() => [Course])
  async getCourses(): Promise<Course[]> {
    return this.courseService.getCourses(); // Fetch all courses
  }


  @Query(() => Course, { nullable: true })
  async course(@Args('id', { type: () => String }) id: string): Promise<Course> {
    return this.courseService.getCourseId(id); // Assuming this exists in your service
  }

  @Query(() => [Course])
  async coursesByStudentId(
    @Args('studentId', { type: () => String }) studentId: string,
  ): Promise<Course[]> {
    return this.courseService.getCoursesByStudentId(studentId);
  }


  @Mutation(() => Course)
  async createCourse(@Args('input') input: CreateCourseInput) {
    return this.courseService.create(input);
  }


  @ResolveField(() => Student)
  async student(@Parent() course: Course) {
    return { __typename: 'Student', id: course.studentId };
  }
}
