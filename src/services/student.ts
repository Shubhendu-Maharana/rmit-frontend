import { apiClient } from "@services/apiClient";
import { Student } from "@app/types/dataTypes";

export const getStudents = async (): Promise<Student[]> => {
  return apiClient.get<Student[]>("/students");
};

export const addStudent = async (student: Student): Promise<Student> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = student;
  return apiClient.post<Student>("/students", rest);
};

export const updateStudent = async (student: Student): Promise<Student> => {
  return apiClient.put<Student>(`/students/${student.id}`, student);
};

export const deleteStudent = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/students/${id}`);
};
