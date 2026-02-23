import supabase from "@services/supabase";

export const uploadFile = async ({
  file,
  bucket,
}: {
  file: File;
  bucket: "student-images" | "faculty-images" | "notices" | "timetables";
}) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  if (publicUrlData && publicUrlData.publicUrl) {
    return publicUrlData.publicUrl;
  }
};
