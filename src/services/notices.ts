import type { Notice } from "@app/types/dataTypes";

export const getNotices = async (): Promise<Notice[]> => {
  return [];
};

export const postNotice = async (notice: Notice): Promise<Notice> => {
  return notice;
};

export const updateNotice = async (notice: Notice): Promise<Notice> => {
  return notice;
};

export const deleteNotice = async (_id: string): Promise<void> => {
  return Promise.resolve();
};
