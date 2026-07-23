// Enums
export type Role = "SUPER_ADMIN" | "ADMIN" | "FACULTY" | "STUDENT";
export type Institute = "RMIT" | "RMITC" | "HIT";
export type Gender = "MALE" | "FEMALE" | "OTHER";

// Course Entity
export interface Course {
  id: string;
  name: string;
  description: string | null;
  institute: Institute;
  createdAt: Date;
  updatedAt: Date;
  facultyProfiles?: FacultyProfile[];
  studentProfiles?: StudentProfile[];
  subjects?: Subject[];
}

// Notice Entity
export interface Notice {
  id: string;
  title: string;
  fileUrl: string;
  institute: Institute | null;
  createdAt: Date;
  updatedAt: Date;
}

// User entity representing credentials and roles
export interface User {
  id: string;
  email: string | null;
  rollNumber: string | null;
  role: Role;
  isDeleted: boolean;
  createdBy: string | null;
  creator?: User | null;
  createdUsers?: User[];
  createdAt: Date;
  updatedAt: Date;
  superAdminProfile?: SuperAdminProfile | null;
  adminProfile?: AdminProfile | null;
  facultyProfile?: FacultyProfile | null;
  studentProfile?: StudentProfile | null;
}

// Profile details for Super Admin
export interface SuperAdminProfile {
  id: string;
  userId: string;
  name: string;
  photo: string | null;
  gender: Gender | null;
  createdAt: Date;
  updatedAt: Date;
}

// Profile details for Admin
export interface AdminProfile {
  id: string;
  userId: string;
  name: string;
  photo: string | null;
  gender: Gender | null;
  institute: Institute | null;
  createdAt: Date;
  updatedAt: Date;
}

// Profile details for Faculty
export interface FacultyProfile {
  id: string;
  userId: string;
  name: string;
  photo: string | null;
  gender: Gender | null;
  institute: Institute | null;
  isHod: boolean;
  joiningDate: Date;
  department: string | null;
  designation: string | null;
  courseId: string | null;
  course?: Course | null;

  // Hiring & Academic Documents
  resumeUrl: string | null;
  joiningLetterUrl: string | null;
  qualificationCerts: string[];

  // Credentials & Experience
  qualification: string | null;
  experienceYears: number | null;
  employmentType: string | null;

  // Contact Info
  phone: string | null;
  address: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// Profile details for Student
export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  photo: string | null;
  gender: Gender | null;
  institute: Institute | null;
  courseId: string | null;
  course?: Course | null;
  year: number | null;

  // Admission & Personal Info
  dateOfBirth: Date | null;
  guardianName: string | null;
  guardianPhone: string | null;
  address: string | null;

  // Admission Documents
  tenthMarksheetUrl: string | null;
  twelfthMarksheetUrl: string | null;
  identityProofUrl: string | null;

  // Academic Progression
  semester: number | null;
  section: string | null;
  batch: string | null;
  academicStatus: string | null;

  // Exit & Alumni Info
  isAlumni: boolean;
  placementStatus: string | null;
  placedCompany: string | null;
  packageLpa: number | null;
  graduationDate: Date | null;

  createdAt: Date;
  updatedAt: Date;
  grades?: Grade[];
  hostelId?: string | null;
  hostel?: Hostel | null;
  roomNumber?: string | null;
}

// Subject Entity
export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  academicYear: string;
  courseId: string;
  course?: Course;
  grades?: Grade[];
  createdAt: Date;
  updatedAt: Date;
}

// Grade Entity
export interface Grade {
  id: string;
  studentId: string;
  student?: StudentProfile;
  subjectId: string;
  subject?: Subject;
  internalMarks: number | null;
  externalMarks: number | null;
  practicalMarks: number | null;
  totalMarks: number | null;
  gradeLetter: string | null;
  gp: number | null;
  passed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Hostel Type Enum
export type HostelType = "BOYS" | "GIRLS" | "COED";

// Hostel Entity
export interface Hostel {
  id: string;
  name: string;
  type: HostelType;
  capacity: number;
  institute: Institute;
  studentProfiles?: StudentProfile[];
  createdAt: Date;
  updatedAt: Date;
}
