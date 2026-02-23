import supabase from "@services/supabase";
import type { Faculty } from "@app/types/dataTypes";

export const getFaculties = async (): Promise<Faculty[]> => {
  const { data, error } = await supabase.from("faculty").select("*");
  if (error) {
    throw error;
  }
  return data as Faculty[];
};
