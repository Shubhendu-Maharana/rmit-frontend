import { Faculty, FacultyCard } from "@app/types/dataTypes";

export const getFaculties = async (): Promise<Faculty[]> => {
  return [];
};

export const getFacultyCards = async (): Promise<FacultyCard[]> => {
  return [];
};

export const createFaculty = async (faculty: Faculty): Promise<Faculty> => {
  return faculty;
};

export const updateFaculty = async (_faculty: Faculty): Promise<void> => {
  return Promise.resolve();
};

export const deleteFaculty = async (_id: string): Promise<void> => {
  return Promise.resolve();
};
