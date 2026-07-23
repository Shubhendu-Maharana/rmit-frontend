import { Faculty, FacultyCard } from "@app/types/dataTypes";
import { apiClient } from "@services/apiClient";

export const getFaculties = async (): Promise<Faculty[]> => {
  return apiClient.get<Faculty[]>("/faculties");
};

export const getFacultyCards = async (): Promise<FacultyCard[]> => {
  const faculties = await getFaculties();
  return faculties.map((faculty) => {
    const instCode =
      faculty.department === "Degree"
        ? "RMIT"
        : faculty.department === "Diploma"
          ? "HIT"
          : faculty.department === "ITI"
            ? "RMITC"
            : "";
    return {
      id: faculty.id,
      fullName: faculty.name,
      email: faculty.email,
      phone: faculty.phone || null,
      designation: faculty.specialization || null,
      profile_photo_url: faculty.image || null,
      instituteId: instCode,
      instituteCode: instCode,
      instituteName: faculty.department,
    };
  });
};

export const createFaculty = async (faculty: Faculty): Promise<Faculty> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...facultyData } = faculty;
  return apiClient.post<Faculty>("/faculties", facultyData);
};

export const updateFaculty = async (faculty: Faculty): Promise<Faculty> => {
  return apiClient.put<Faculty>(`/faculties/${faculty.id}`, faculty);
};

export const deleteFaculty = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/faculties/${id}`);
};
