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
@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async getCourses(): Promise<Course[]> {
    const courses = await this.courseRepository.find();
    return courses;
  }

  async create(createCourseInput: CreateCourseInput): Promise<Course> {
    const course = this.courseRepository.create({
      name: createCourseInput.name,
      studentId: createCourseInput.studentId,
    });
    return this.courseRepository.save(course);
  }

async getCoursesByStudentId(studentId: string): Promise<Course[]> {
    return this.courseRepository.find({ where: { studentId } });
  }

  async getCourseId(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id: id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }
}
