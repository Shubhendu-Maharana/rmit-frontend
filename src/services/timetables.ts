import type { Timetable } from "@app/types/dataTypes";

export const getTimeTables = async (): Promise<Timetable[]> => {
  return [];
};

export const postTimetable = async (
  timetable: Timetable,
): Promise<Timetable> => {
  return timetable;
};

export const updateTimetable = async (
  timetable: Timetable,
): Promise<Timetable> => {
  return timetable;
};

export const deleteTimetable = async (_id: string): Promise<void> => {
  return Promise.resolve();
};
