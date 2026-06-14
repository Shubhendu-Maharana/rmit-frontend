import { Database } from "@app/types/supabase";

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

export type Faculty = Database["public"]["Tables"]["faculties"]["Row"];

export type FacultyCard = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  designation: string | null;
  profile_photo_url: string | null;
  instituteId: string;
  instituteCode: string;
  instituteName: string;
};

export type Department =
  | "Computer Science"
  | "Business"
  | "Engineering"
  | "Arts & Sciences"
  | "Medicine"
  | "";

export interface Student {
  id: string;
  roll_number: string;
  name: string;
  email: string;
  phone: number;
  image: string;
  department: Department;
  semester: number;
  dob: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  guardian_name: string;
  guardian_phone: number;
  admission_date: string;
}
