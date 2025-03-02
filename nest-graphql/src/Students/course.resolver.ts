import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Course } from "./dto/courseDto";
import { Student } from "./entities/student.entity";
import { StudentService } from "./student.service";



@Resolver((of) => Course)
export class CourseResolver {
  constructor(
    private readonly studentsService: StudentService,
  ) {}


  @ResolveField((of) => [Student])
  student(@Parent() course: Course): Promise<Student[]> {
    console.log("dd111111d")
      return this.studentsService.forProject(course.id);
  }


}
