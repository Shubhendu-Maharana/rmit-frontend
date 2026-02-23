import { useEffect, useState } from "react";
import SideBar from "../../components/layout/SideBar";
import FacultyTab from "./tabs/Faculty/FacultyTab";
import StudentTab from "./tabs/Student/StudentTab";
import NoticesTab from "./tabs/Notice/NoticesTab";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

type Department =
  | "Computer Science"
  | "Business"
  | "Engineering"
  | "Arts & Sciences"
  | "Medicine"
  | "";

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

const AdminDashboard = () => {
  const navigator = useNavigate();
  const [activeTab, setActiveTab] = useState("faculty");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigator("/adminlogin");
    }
  }, [navigator, user, isLoading]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4 shadow-sm z-30">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <FiMenu size={24} className="text-gray-600" />
              </button>
            )}
            <h1 className="md:text-2xl text-xl font-bold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Faculty tab */}
            {activeTab === "faculty" && <FacultyTab />}

            {activeTab === "students" && (
              <StudentTab StudentData={StudentData} />
            )}

            {activeTab === "notices" && <NoticesTab />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
