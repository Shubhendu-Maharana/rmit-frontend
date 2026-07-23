import { Student } from "@app/types/dataTypes";

export const getStudents = async (): Promise<Student[]> => {
  return [];
};

export const addStudent = async (student: Student): Promise<Student> => {
  return student;
};

export const updateStudent = async (student: Student): Promise<Student> => {
  return student;
};

export const deleteStudent = async (_id: string): Promise<void> => {
  return Promise.resolve();
};
