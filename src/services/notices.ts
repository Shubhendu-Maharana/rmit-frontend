import { apiClient } from "@services/apiClient";
import type { Notice } from "@app/types/dataTypes";

export const getNotices = async (): Promise<Notice[]> => {
  return apiClient.get<Notice[]>("/notices");
};

export const postNotice = async (notice: Notice): Promise<Notice> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = notice;
  return apiClient.post<Notice>("/notices", rest);
};

export const updateNotice = async (notice: Notice): Promise<Notice> => {
  return apiClient.put<Notice>(`/notices/${notice.id}`, notice);
};

export const deleteNotice = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/notices/${id}`);
};
