import { gql } from 'apollo-angular';

export const GET_STUDENTS = gql`
  query GetStudent($limit: Int!, $offset: Int!) {
    getStudent(limit: $limit, offset: $offset) {
      student {
        id
        fname
        lname
        email
        dob
        age
      }
      paginationObject {
        total
      }
    }
  }
`;

export const CREATE_STUDENTS = gql`
  mutation createStudent($input: CreateStudentInputDto!) {
    createStudent(createStudentInputDto: $input) {
      id
      fname
      lname
      email
      courseID
      dob
    }
  }
`;

export const CREATE_COURSES = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      name
    }
  }
`;
export const UPDATE_STUDENTS = gql`
  mutation updateStudent($input: UpdateStudentInput!) {
    updateStudent(UpdateStudentInput: $input) {
      id
      fname
      lname
      email
      courseID
      dob
    }
  }
`;


export const UPDATE_COURSES = gql`
  mutation updateCourse($input: UpdateCourseInput!) {
    updateCourse(UpdateCourseInput: $input) {
      id
      name
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation deleteStudent($id: String!) {
    deleteStudent(id: $id)
  }
`;

export const DOWNLOAD_STUDENTS = gql`
  query DownloadStudent($age: Int!, $token: String!) {
    downloadExcel(age: $age, token: $token)
  }
`;

export const GET_COURSES = gql`
  query GetCourses($limit: Int!, $offset: Int!) {
    getCourses(limit: $limit, offset: $offset) {
      id
      name
      student {
        id
        fname
      }
    }
  }
`;


export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    getAllCourses {
      id
      name
    }
  }
`;
