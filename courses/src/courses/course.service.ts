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
    return courses;
  }

  async getAllCourses(): Promise<Course[]> {
    const courses = await this.courseRepository.find();
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


  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    // console.log(course)
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }


  async getCourseId(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id: id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }
}
