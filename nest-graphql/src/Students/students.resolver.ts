import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  BadRequestException,
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
    return response
  }


  @Query(() => [Student], { name: 'getAllStudent' })
  findAll() {
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

  @ResolveField(() => Course, { nullable: true })
  async course(@Parent() student: Student) {
    if (!student.courseID) {
      return null; // No course ID, return null
    }
    return { __typename: 'Course', code: student.courseID }; // Return a reference
  }

}
