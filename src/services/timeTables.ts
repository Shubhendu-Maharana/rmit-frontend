import { apiClient } from "@services/apiClient";
import type { Timetable } from "@app/types/dataTypes";

export const getTimeTables = async (): Promise<Timetable[]> => {
  return apiClient.get<Timetable[]>("/timetables");
};

export const postTimetable = async (
  timetable: Timetable,
): Promise<Timetable> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = timetable;
  return apiClient.post<Timetable>("/timetables", rest);
};

export const updateTimetable = async (
  timetable: Timetable,
): Promise<Timetable> => {
  return apiClient.put<Timetable>(`/timetables/${timetable.id}`, timetable);
};

export const deleteTimetable = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/timetables/${id}`);
};
