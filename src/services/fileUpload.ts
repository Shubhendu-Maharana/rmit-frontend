import { apiClient } from "@services/apiClient";

export const uploadFile = async ({
  file,
  bucket,
}: {
  file: File;
  bucket: "student-images" | "faculty-images" | "notices" | "timetables";
}): Promise<string> => {
  if (apiClient.isDemoMode()) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file in demo mode"));
      };
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);

  const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("rmit_auth_token")}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error((await res.text()) || "Upload failed");
  const data = await res.json();
  return data.url; // assuming backend returns { url: "..." }
};
