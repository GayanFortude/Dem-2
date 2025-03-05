import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { Course } from './entities/course';
import { CreateCourseInput } from './dto/createCourseDto';
import { UpdateCourseInput } from './dto/updateCourseInput';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async getCourses(limit: number, offset: number): Promise<Course[]> {
    const courses = await this.courseRepository.find({
      skip: offset,
      take: limit,
    });
    return courses;
  }

  async getAllCourses(): Promise<Course[]> {
    const courses = await this.courseRepository.find();
    return courses;
  }

  async update(
    //update
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
    try {
      const course = this.courseRepository.create({
        name: createCourseInput.name,
        code: createCourseInput.code,
      });
      return this.courseRepository.save(course);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async find(p0: (course: any) => boolean) {
    try {
      return this.courseRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(code: string): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({ where: { code:code } });
      if (!course) {
        throw new NotFoundException(`Course with ID ${code} not found`);
      }
      return course;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getCourseId(id: string): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({ where: { code: id } });
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return course;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
