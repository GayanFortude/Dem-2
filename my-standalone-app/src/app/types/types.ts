export class paginationStudent {
  total: number
  constructor() {
    this.total = 0;
  }
}


export interface Student {
  id: string;
  fname: string;
  age:string;
  lname: string;
  email: string;
  courseID:string;
  dob: Date;
}


export interface Course {
  id: string;
  name: string;
}



export interface GetStudentResponse {
  getStudent: {
    student: Student[];
    paginationObject: {
      total: number;
    };
  };
}



