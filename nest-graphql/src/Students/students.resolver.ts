import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { CreateStudentInputDto } from './dto/CreateStudentInputDto';
import { UpdateStudentInput } from './dto/updateStudentInput';
import { Student } from './entities/student.entity';
import { StudentResponse } from './objects/studentResponse';
import { StudentService } from './student.service';
import { ExcelService } from 'src/queue/excel.service';
import { Course } from './dto/courseDto';

@Resolver(() => Student)
export class StudentResolver {
  constructor(
    private readonly studentsService: StudentService,
    private excelService: ExcelService,
  ) {}

  @Query(() => StudentResponse) //Get User
  async getStudent(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<StudentResponse> {
    const response = await this.studentsService.findAll(limit, offset);
    console.log(response);
    return response
  }

  // @Query(() => [Student])
  // async students() {
  //   return this.studentsService.getAll(); // Fetch all students from DB
  // }


  @Query(() => [Student], { name: 'getAllStudent' })
  findAll() {
    console.log("ddd")
    return this.studentsService.getAll();
  }

  @Query(() => String, { name: 'downloadExcel' })
  async downloadExcel(
    @Args('age', { type: () => Int, defaultValue: 10 }) age: number,
    @Args('token', { type: () => String, defaultValue: '10' }) token: string,
    @Res() res: Response,
  ) {
    await this.excelService.processdownloadExcel(age, token);
    return 'File uploaded successfully';
  }

  @Mutation(() => Student) //Create user
  async createStudent(
    @Args('createStudentInputDto') createStudentInputDto: CreateStudentInputDto,
  ): Promise<Student> {
    try {
      return await this.studentsService.create(createStudentInputDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Mutation(() => Boolean)
  async deleteStudent(@Args('id') id: string): Promise<boolean> {
    //delete
    try {
      return await this.studentsService.deleteStudent(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Mutation(() => Student) //Update user
  async updateStudent(
    @Args('UpdateStudentInput') updateStudentInput: UpdateStudentInput,
  ): Promise<Student | null> {
    try {
      return this.studentsService.update(
        updateStudentInput.id,
        updateStudentInput,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @ResolveField((of) => Course)
  course(@Parent() student: Student) {
    console.log("s1s",student)
    return { __typename: 'course', id: student.courseID };
  }

  // @ResolveField(() => [Course], { nullable: true })
  // async courses(@Parent() student: Student) {
  //   console.log(1)
  //   return this.studentsService.getCoursesByStudentId(student.id).then(courses =>
  //     courses.map(course => ({
  //       __typename: 'Course',
  //       id: course.id,
  //       name:"123"
  //     }))
  //   );
  // }

  // @ResolveReference()
  // async resolveReference(reference: {
  //   __typename: string;
  //   id: string;
  // }): Promise<Student> {
  //   return this.studentsService.getStudent(reference.id);
  // }

  // @ResolveReference()
  // async resolveReference(reference: { __typename: string; id: string }): Promise<Student> {
  //   return this.studentsService.findById(reference.id);
  // }

  // @ResolveField((of) => CourseType)
  // user(@Parent() course: CourseType): any {
  //   return { __typename: 'CourseType', id: course.id };
  // }

  // @ResolveField('course', () => CourseType, { nullable: true })
  // async course(@Parent() student: Student) {
  //   return { __typename: 'CourseType', id: student.courseID };
  // }

  // @ResolveField(() => [CourseType], { nullable: true })
  // async courses(@Parent() student: Student) {
  //  // return this.coursesService.getCoursesByStudentId(student.id); 
  // }

  // private students = [
  //   { id: '1', fname: 'John', lname: 'Doe', email: 'john@example.com', courseId: '101' },
  //   { id: '2', fname: 'Jane', lname: 'Smith', email: 'jane@example.com', courseId: '102' },
  // ];

  // @Query(() => [Student])
  // async students() {
  //   return this.students;
  // }

  // @ResolveReference()
  // resolveReference(reference: { id: string }) {
  //   return this.studentsService.getAll(student => student.id === reference.id);
  // }

}
