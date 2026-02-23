import supabase from "@services/supabase";
import { Student } from "@app/types/dataTypes";

export const getStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase.from("students").select("*");
  if (error) {
    throw error;
  }
  return data as Student[];
};

export const addStudent = async (student: Student): Promise<Student> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = student;
  const { data, error } = await supabase
    .from("students")
    .insert([rest])
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Student;
};

export const updateStudent = async (student: Student): Promise<Student> => {
  const { id, ...rest } = student;
  const { data, error } = await supabase
    .from("students")
    .update(rest)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Student;
};

export const deleteStudent = async (id: string): Promise<void> => {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
