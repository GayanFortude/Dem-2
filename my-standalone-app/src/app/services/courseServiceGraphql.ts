import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  CREATE_COURSES,
  GET_ALL_COURSES,
  GET_COURSES,
  UPDATE_COURSES,
} from '../core/graphql.operations';


@Injectable()
export class CourseServiceGraphql {
  public object: Observable<any[]>;
  private observable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private skip = 0;
  private data: unknown[] = [];
  private completed = false;

  constructor(private apollo: Apollo) {
    this.object = this.observable.asObservable();
  }
  public loading = false;
  resetPagination(): void {
    //Reset pagination
    this.skip = 0;
    this.completed = false;
    this.data = [];
    // this.observable.next(this.data);
  }

  loadMore(take: number, reset: boolean): Observable<boolean> {
    if (this.completed) {
      return from([true]);
    }

    if (reset) {
      this.skip = 0;
      this.data = [];
    }

    this.loading = true; // Show loading spinner in grid

    return this.apollo
      .watchQuery<any>({
        query: GET_COURSES,
        fetchPolicy: "network-only",
        variables: { limit: take, offset: this.skip },
      })
      .valueChanges.pipe(
        map((result) => result?.data?.getCourses || []),
        tap((values) => {
        
          if (values.length === 0 ) {
            this.completed = true;
          } 
          else {
            if (reset) {
              this.skip = 0;  
              this.completed = false; 
              this.data = []; 
              this.data = [...this.data, ...values];
              this.observable.next(this.data);
              this.skip += values.length;
            }
            else{
              this.data = [...this.data, ...values];
              this.observable.next(this.data);
              this.skip += values.length;
            }
          }
       
        }),
        map((values) => values.length > 0)
      );
  }


  
    async getAllCourses(): Promise<{ id: string }[]> {
      const result = await this.apollo
        .query<{ getAllCourses: { id: string }[] }>({
          query: GET_ALL_COURSES,
        })
        .toPromise(); 
  
      return result?.data?.getAllCourses || [];
    }
  

  createCourse(courseData: { name: string }): Observable<any> {

    return this.apollo
      .mutate({
        mutation: CREATE_COURSES, 
        variables: { input: courseData },
      })
      .pipe(map((result: any) => result.data?.input));
  }

  updateCourse(courseData: {
    name: string;
  }): Observable<any> {
    //update data
    return this.apollo
      .mutate({
        mutation: UPDATE_COURSES,
        variables: { input: courseData },
      })
      .pipe(map((result: any) => result.data?.UpdateCourseInput));
  }

}
