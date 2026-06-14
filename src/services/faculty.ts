import { Faculty, FacultyCard } from "@app/types/dataTypes";
import supabase from "@services/supabase";

export const getFaculties = async (): Promise<FacultyCard[]> => {
  const { data, error } = await supabase
    .from("faculties")
    .select(
      `
        id,
        first_name,
        last_name,
        email,
        phone,
        profile_photo_url,
        designation,
        institutes (
            id,
            code,
            name
        )
      `,
    )
    .order("first_name");

  if (error) {
    throw error;
  }

  const facultyCards: FacultyCard[] =
    data?.map((faculty) => ({
      id: faculty.id,
      fullName: `${faculty.first_name} ${faculty.last_name ?? ""}`.trim(),
      email: faculty.email,
      phone: faculty.phone,
      designation: faculty.designation,
      profile_photo_url: faculty.profile_photo_url,
      instituteId: faculty.institutes?.id ?? "",
      instituteCode: faculty.institutes?.code ?? "",
      instituteName: faculty.institutes?.name ?? "",
    })) ?? [];

  return facultyCards;
};

export const createFaculty = async (faculty: Faculty) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...facultyData } = faculty;

  const { data, error } = await supabase
    .from("faculties")
    .insert([facultyData])
    .select();
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Failed to create faculty");
  }
  return data[0];
};

export const updateFaculty = async (faculty: Faculty) => {
  const { id, ...facultyData } = faculty;
  const { error } = await supabase
    .from("faculties")
    .update([facultyData])
    .eq("id", id);
  if (error) {
    throw error;
  }
};

export const deleteFaculty = async (id: string) => {
  const { error } = await supabase.from("faculties").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
