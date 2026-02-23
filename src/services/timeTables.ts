import supabase from "@services/supabase";
import type { Timetable } from "@app/types/dataTypes";

export const getTimeTables = async (): Promise<Timetable[]> => {
  const { data, error } = await supabase.from("timetables").select("*");
  if (error) {
    throw error;
  }
  return data as Timetable[];
};

export const postTimetable = async (
  timetable: Timetable,
): Promise<Timetable> => {
  const { data, error } = await supabase
    .from("timetables")
    .insert([
      {
        program: timetable.program,
        program_type: timetable.program_type,
        semester: timetable.semester,
        academic_year: timetable.academic_year,
        last_updated: timetable.last_updated,
        file_link: timetable.file_link,
      },
    ])
    .select();
  if (error) {
    throw error;
  }
  return data[0] as Timetable;
};

export const updateTimetable = async (
  timetable: Timetable,
): Promise<Timetable> => {
  const { data, error } = await supabase
    .from("timetables")
    .update(timetable)
    .eq("id", timetable.id)
    .select();
  if (error) {
    throw error;
  }
  return data[0] as Timetable;
};

export const deleteTimetable = async (id: string): Promise<void> => {
  const { error } = await supabase.from("timetables").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
