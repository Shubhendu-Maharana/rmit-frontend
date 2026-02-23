import supabase from "./supabase";
import type { Notice } from "@app/types/dataTypes";

export const getNotices = async (): Promise<Notice[]> => {
  const { data, error } = await supabase.from("notices").select("*");
  if (error) {
    throw error;
  }
  return data as Notice[];
};

