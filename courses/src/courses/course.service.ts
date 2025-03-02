import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Course,  } from './entities/course';
import { CreateCourseInput } from './dto/createCourseDto';
import { UpdateCourseInput } from './dto/updateCourseInput';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async getCourses(limit: number, offset: number): Promise<Course[]> {
    const courses = await this.courseRepository.find(
      {
        skip: offset,
        take: limit,
      }
    );
    console.log("sss",courses)
    return courses;
  }

  async getAllCourses(): Promise<Course[]> {
    const courses = await this.courseRepository.find();
    console.log("sss",courses)
    return courses;
  }

  async update( //update
    id: string,
    updateCourseInput: UpdateCourseInput,
  ): Promise<Course | null> {
    try {
      const course = await this.courseRepository.find({ where: { id } });
      if (!course) {
        throw new NotFoundException();
      }
      await this.courseRepository.update(id, updateCourseInput);
      return this.courseRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  

  async create(createCourseInput: CreateCourseInput): Promise<Course> {
    const course = this.courseRepository.create({
      name: createCourseInput.name,
      // studentId: createCourseInput.studentId,
    });
    return this.courseRepository.save(course);
  }

  async find(p0: (course: any) => boolean){
    return this.courseRepository.find()
  }

  async getStudentsByCourseId(courseId: string): Promise<any[]> {
    // This could call the student service via REST/gRPC or return references
    // For Federation, return references to let the gateway resolve them
    const studentIds = await this.fetchStudentIdsByCourseId(courseId); // Hypothetical method
    return studentIds.map(id => ({ __typename: 'StudentType', id }));
  }

  private async fetchStudentIdsByCourseId(courseId: string): Promise<string[]> {
    // Replace with real logic: DB query, HTTP call to student service, etc.
    // Example: SELECT id FROM students WHERE courseID = courseId
    return ['student1', 'student2']; // Mock data
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    // console.log(course)
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

// async getCoursesByStudentId(studentId: string): Promise<Course[]> {
//     return this.courseRepository.find({ where: { studentId } });
//   }

  // findAllByAuthorId(authorId: string): Student[] {
  //   return []
  // }

  async getCourseId(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id: id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }
}
