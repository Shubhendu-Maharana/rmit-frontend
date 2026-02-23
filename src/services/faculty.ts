import supabase from "@services/supabase";
import type { Faculty } from "@app/types/dataTypes";

export const getFaculties = async (): Promise<Faculty[]> => {
  const { data, error } = await supabase.from("faculty").select("*");
  if (error) {
    throw error;
  }
  return data as Faculty[];
};

export const createFaculty = async (faculty: Faculty) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...facultyData } = faculty;

  const { data, error } = await supabase
    .from("faculty")
    .insert([facultyData])
    .select();
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Failed to create faculty");
  }
  return data[0] as Faculty;
};

export const updateFaculty = async (faculty: Faculty) => {
  const { id, ...facultyData } = faculty;
  const { error } = await supabase
    .from("faculty")
    .update([facultyData])
    .eq("id", id);
  if (error) {
    throw error;
  }
};

export const deleteFaculty = async (id: string) => {
  const { error } = await supabase.from("faculty").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
