import supabase from "@services/supabase";
import type { Timetable } from "@app/types/dataTypes";

export const getTimeTables = async (): Promise<Timetable[]> => {
  const { data, error } = await supabase.from("timetables").select("*");
  if (error) {
    throw error;
  }
  return data as Timetable[];
};
