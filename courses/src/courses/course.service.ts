import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    try {
      const courses = await this.courseRepository.find({
        skip: offset,
        take: limit,
      });
      return courses;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllCourses(): Promise<Course[]> {
    try {
      const courses = await this.courseRepository.find();
      return courses;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    //update
    id: string,
    updateCourseInput: UpdateCourseInput,
  ): Promise<Course | null> {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      await this.courseRepository.update(id, updateCourseInput);
      return this.courseRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createCourseInput: CreateCourseInput): Promise<Course> {
    //Create
    try {
      const id = await this.courseRepository.findOne({
        where: { code: createCourseInput.code },
      });
      if (id) {
        throw new HttpException(
          'Course with this code already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const course = this.courseRepository.create({
        name: createCourseInput.name,
        code: createCourseInput.code,
      });
      return this.courseRepository.save(course);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByCode(code: string): Promise<Course | null> {
    try {
      const course = await this.courseRepository.findOne({
        where: { code: code },
      });
      if (!course) {
        return null;
      }
      return course;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCourseId(code: string): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({
        where: { code: code },
      });
      if (!course) {
        throw new NotFoundException(`Course with ID ${code} not found`);
      }
      return course;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
