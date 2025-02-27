import { Injectable } from '@nestjs/common';
import { ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GraphqlResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {

        if (data.student) {
          const students = data.student.map((d) => ({
            id: d.id,
            fname: d.fname,
            lname: d.lname,
            email: d.email,
            dob:d.dob,
            age: parseInt(Math.floor((new Date().getTime() - new Date(d.dob).getTime()) / (1000 * 60 * 60 * 24 * 365)).toString())
          }));
          data.student=students
          return {
            ...data
          }
        }
        return data
      }),
    );
  }
}
