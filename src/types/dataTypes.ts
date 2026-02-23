export type NoticeCategory =
  | "academic"
  | "administrative"
  | "events"
  | "exams"
  | "all";

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
  file_path: string;
  important: boolean;
}

export type Semester = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type ProgramType = "Degree" | "Diploma" | "ITI";

export interface Timetable {
  id: string;
  program: string;
  program_type: ProgramType;
  semester: Semester;
  academic_year: string;
  last_updated: string;
  file_link: string;
}

export interface Faculty {
  id: string;
  name: string;
  image: string;
  department: string;
  specialization: string;
  email: string;
  phone: string;
  education: string;
  is_hod: boolean;
  joining_date: string;
}
