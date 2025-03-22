import { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import FacultyTab from "./tabs/Faculty/FacultyTab";
import StudentTab from "./tabs/Student/StudentTab";
import NoticesTab from "./tabs/Notice/NoticesTab";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

type Department =
  | "Computer Science"
  | "Business"
  | "Engineering"
  | "Arts & Sciences"
  | "Medicine"
  | "";

interface Faculty {
  id: string;
  name: string;
  email: string;
  department: Department;
  position: string;
  joined: string;
  initials: string;
}

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: number;
  department: Department;
  semster: number;
  dob: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  guardianName: string;
  guardianPhone: number;
  admissionDate: string;
}

type NoticeCategory = "Academic" | "Administrative" | "Events" | "Exams" | "";

type Notice = {
  id: string;
  title: string;
  date: string;
  category: Exclude<NoticeCategory, "all">;
  file_path: string | "";
  important: boolean;
};

const FacultyData: Faculty[] = [
  {
    id: "FAC-2020-0018",
    name: "Dr. Jane Wilson",
    email: "jane.wilson@college.edu",
    department: "Computer Science",
    position: "Associate Professor",
    joined: "Sep 2020",
    initials: "JW",
  },
  {
    id: "FAC-2019-0042",
    name: "Dr. Robert Chen",
    email: "robert.chen@college.edu",
    department: "Engineering",
    position: "Professor",
    joined: "Jan 2019",
    initials: "RC",
  },
  {
    id: "FAC-2021-0103",
    name: "Dr. Maria Garcia",
    email: "maria.garcia@college.edu",
    department: "Business",
    position: "Assistant Professor",
    joined: "Mar 2021",
    initials: "MG",
  },
  {
    id: "FAC-2022-0076",
    name: "Dr. James Smith",
    email: "james.smith@college.edu",
    department: "Arts & Sciences",
    position: "Lecturer",
    joined: "Aug 2022",
    initials: "JS",
  },
  {
    id: "FAC-2018-0009",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@college.edu",
    department: "Computer Science",
    position: "Professor",
    joined: "Feb 2018",
    initials: "SJ",
  },
];

const StudentData: Student[] = [
  {
    id: "1a2b3c4d-5678-9101-1121-314151617181",
    rollNumber: "MCA2025001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: 9876543210,
    department: "Computer Science",
    semster: 2,
    dob: "2002-08-15",
    gender: "Male",
    address: "123, ABC Colony, Bhubaneswar, Odisha",
    guardianName: "Rajesh Sharma",
    guardianPhone: 9876543211,
    admissionDate: "2024-07-20",
  },
  {
    id: "2b3c4d5e-6789-0123-4567-890123456789",
    rollNumber: "MCA2025002",
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: 9123456789,
    department: "Computer Science",
    semster: 1,
    dob: "2003-05-10",
    gender: "Female",
    address: "456, XYZ Street, Cuttack, Odisha",
    guardianName: "Anita Verma",
    guardianPhone: 9123456790,
    admissionDate: "2025-01-15",
  },
  {
    id: "3c4d5e6f-7890-1234-5678-901234567890",
    rollNumber: "MCA2025003",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: 9988776655,
    department: "Computer Science",
    semster: 3,
    dob: "2001-11-25",
    gender: "Male",
    address: "789, LMN Road, Rourkela, Odisha",
    guardianName: "Sunil Kumar",
    guardianPhone: 9988776656,
    admissionDate: "2023-08-10",
  },
  {
    id: "4d5e6f7g-8901-2345-6789-012345678901",
    rollNumber: "MCA2025004",
    name: "Sneha Das",
    email: "sneha.das@example.com",
    phone: 9865321470,
    department: "Computer Science",
    semster: 4,
    dob: "2000-12-05",
    gender: "Female",
    address: "159, PQR Nagar, Sambalpur, Odisha",
    guardianName: "Ramesh Das",
    guardianPhone: 9865321471,
    admissionDate: "2022-06-25",
  },
];

const notices: Notice[] = [
  {
    id: "n001",
    title: "Final Examination Schedule Released",
    date: "2025-03-15",
    category: "Exams",
    file_path: "",
    important: true,
  },
  {
    id: "n002",
    title: "Campus Closure: Spring Break",
    date: "2025-03-10",
    category: "Administrative",
    file_path: "",
    important: false,
  },
  {
    id: "n003",
    title: "New Course Registration Opens",
    date: "2025-03-05",
    category: "Academic",
    file_path: "",
    important: true,
  },
  {
    id: "n004",
    title: "Annual Technology Symposium",
    date: "2025-03-01",
    category: "Events",
    file_path: "",
    important: false,
  },
  {
    id: "n005",
    title: "Library Extended Hours",
    date: "2025-02-28",
    category: "Administrative",
    file_path: "",
    important: false,
  },
  {
    id: "n006",
    title: "Scholarship Application Deadline",
    date: "2025-02-25",
    category: "Academic",
    file_path: "",
    important: true,
  },
  {
    id: "n007",
    title: "Mid-Term Grades Released",
    date: "2025-02-20",
    category: "Exams",
    file_path: "",
    important: false,
  },
  {
    id: "n008",
    title: "Career Fair: Spring Edition",
    date: "2025-02-15",
    category: "Events",
    file_path: "",
    important: true,
  },
];

const AdminDashboard = () => {
  const navigator = useNavigate();
  const [activeTab, setActiveTab] = useState("faculty");
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we're sure the user isn't authenticated (not loading and no user)
    if (!isLoading && !user) {
      navigator("/adminlogin");
    }
  }, [user, isLoading]); // Add isLoading to the dependency array

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4 shadow-sm">
          <div className="flex items-center">
            <h1 className="md:text-2xl text-xl font-bold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Faculty tab */}
          {activeTab === "faculty" && <FacultyTab />}

          {activeTab === "students" && <StudentTab StudentData={StudentData} />}

          {activeTab === "notices" && <NoticesTab />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
