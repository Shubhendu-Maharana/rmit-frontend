import supabase from "@services/supabase";
import type { Notice } from "@app/types/dataTypes";

export const getNotices = async (): Promise<Notice[]> => {
  const { data, error } = await supabase.from("notices").select("*");
  if (error) {
    throw error;
  }
  return data as Notice[];
};

export const postNotice = async (notice: Notice): Promise<Notice> => {
  const { data, error } = await supabase
    .from("notices")
    .insert([
      {
        title: notice.title,
        date: notice.date,
        category: notice.category,
        file_path: notice.file_path,
        important: notice.important,
      },
    ])
    .select();
  if (error) {
    throw error;
  }
  return data[0] as Notice;
};

export const updateNotice = async (notice: Notice): Promise<Notice> => {
  const { data, error } = await supabase
    .from("notices")
    .update(notice)
    .eq("id", notice.id)
    .select();
  if (error) {
    throw error;
  }
  return data[0] as Notice;
};

export const deleteNotice = async (id: string): Promise<void> => {
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
