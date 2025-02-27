import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateStudentInputDto } from './dto/CreateStudentInputDto';
import { UpdateStudentInput } from './dto/updateStudentInput';
import { Student } from './entities/student.entity';
import { ProducerService } from 'src/kafka/poducer/producer.service';
import { environment } from 'src/common/environment';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly _kafka: ProducerService,
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  async create(createStudentInput: CreateStudentInputDto): Promise<Student> {
    //save data
    try {
      const newStudent =
        await this.studentRepository.create(createStudentInput);
      return this.studentRepository.save(newStudent); // retrive data
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createTopic(message: string, user: string, filePath: string, type: 'success' | 'error' = 'success') {
    try {
      const payload = { //payload to send
        message,         
        user, 
        filePath,           
        type,           
        timestamp: new Date().toISOString(),
      };

      // Produce the Kafka message
      await this._kafka.produce({
        topic: 'create-employee',
        messages: [
          {
            key: user,              
            value: JSON.stringify(payload), 
          },
        ],
      });

    } catch (error) {
      throw error;
    }
  }

  async bulkCreate(element: any): Promise<Student> {
    const student = this.studentRepository.create({
      //create objects
      fname: element[environment.requiredFields[0]] as string,
      lname: element[environment.requiredFields[1]] as string,
      email: element[environment.requiredFields[2]] as string,
      dob: new Date(
        ((element[environment.requiredFields[3]] as number) - 25569) *
          86400 *
          1000,
      ),
    });
    return student;
  }

  async bulkInsert(student: Student) {}

  calculateAge(dob: Date): number {
    //calculate age
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  async findAll(limit: number, offset: number) {
    //find all
    const studentcount = await this.studentRepository.findAndCount(); //Count rows

    const studentDB = await this.studentRepository.find({
      skip: offset,
      take: limit,
    }); //retrive data

    const students = studentDB.map((d) => ({
      id: d.id,
      fname: d.fname,
      lname: d.lname,
      email: d.email,
      dob: d.dob,
      age: this.calculateAge(d.dob),
    }));

    if (!studentDB) {
      throw new NotFoundException();
    }

    const paginationStudent = {
      //Bind data
      total: studentcount[1],
      page: offset,
      limit: limit,
    };
    return {
      student: students,
      paginationObject: paginationStudent,
    };
  }

  async update( //update
    id: string,
    updateStudentInput: UpdateStudentInput,
  ): Promise<Student | null> {
    try {
      const student = await this.studentRepository.find({ where: { id } });
      if (!student) {
        throw new NotFoundException();
      }
      await this.studentRepository.update(id, updateStudentInput);
      return this.studentRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteStudent(id: string): Promise<boolean> {
    //delete student
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        throw new NotFoundException();
      }
      const result = await this.studentRepository.delete({ id: id });
      if (result.affected == 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getStudentsByAge(age: any) {
    //kafca
    try {
      const data = await this.studentRepository.find();
      if (!data) {
        throw new NotFoundException();
      }
      const filteredStudents = data
        .filter((d) => this.calculateAge(d.dob) < age)
        .map((d) => ({
          id: d.id,
          fname: d.fname,
          lname: d.lname,
          email: d.email,
          dob: d.dob,
          age: this.calculateAge(d.dob),
        }));

      return filteredStudents;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  

  async getStudent(id: string): Promise<Student> {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  // async getCoursesByStudentId(studentId: string) {
  //   try {
  //     await this.getStudent(studentId);

  //     // Query the courses-service GraphQL API
  //     const query = `
  //       query {
  //         coursesByStudentId(studentId: "${studentId}") {
  //           id
  //           name
  //         }
  //       }
  //     `;
  //     const response = await firstValueFrom(
  //       this.httpService.post('http://localhost:3004/graphql', { query }), //send request to federation gateway
  //     );
  //     const courses = response.data.data.coursesByStudentId || [];
  //     return courses.map((course: { id: string ,name:string}) => ({ id: course.id,name:course.name }));

  //   } catch (error) {
 
  //     return [];
  //   }
  // }


}
