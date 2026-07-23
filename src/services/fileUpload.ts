export const uploadFile = async ({
  file,
}: {
  file: File;
  bucket: "student-images" | "faculty-images" | "notices" | "timetables";
}): Promise<string> => {
  return Promise.resolve(URL.createObjectURL(file));
};
