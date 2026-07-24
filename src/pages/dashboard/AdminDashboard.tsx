import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import UserManagement from "./tabs/UserManagement";
import CourseManagement from "./tabs/CourseManagement";
import NoticeManagement from "./tabs/NoticeManagement";
import SubjectManagement from "./tabs/SubjectManagement";
import FeeManagement from "./tabs/FeeManagement";
import StudentPayments from "./tabs/StudentPayments";

const AdminDashboard = () => {
  const navigator = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    if (!user) {
      navigator("/adminlogin");
    }
  }, [navigator, user]);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "courses":
        return <CourseManagement />;
      case "notices":
        return <NoticeManagement />;
      case "subjects":
        return <SubjectManagement />;
      case "fees":
        return <FeeManagement />;
      case "student-payments":
        return <StudentPayments />;
      case "dashboard":
      default:
        return (
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
            <h2 className="text-3xl font-extrabold text-primary-900 mb-2 font-sans">
              Welcome Back!
            </h2>
            <p className="text-gray-500 mb-6 font-sans">
              Securely logged in as:
            </p>
            <div className="bg-primary-50 p-4 rounded-xl text-left border border-primary-100 mb-6">
              <p className="text-sm font-semibold text-primary-900 font-sans">
                Email:{" "}
                <span className="font-normal text-gray-700">
                  {user?.email || "N/A"}
                </span>
              </p>
              <p className="text-sm font-semibold text-primary-900 font-sans mt-2">
                Role:{" "}
                <span className="font-normal text-gray-700">{user?.role}</span>
              </p>
              {user?.rollNumber && (
                <p className="text-sm font-semibold text-primary-900 font-sans mt-2">
                  Roll Number:{" "}
                  <span className="font-normal text-gray-700">
                    {user?.rollNumber}
                  </span>
                </p>
              )}
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Rajiv Memorial Institute of Technology Management System
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden pointer-events-auto"
              >
                <FiMenu size={24} className="text-gray-600" />
              </button>
            )}
            <h1 className="md:text-2xl text-xl font-bold text-gray-855 font-sans">
              {activeTab === "users"
                ? "User Management"
                : activeTab === "courses"
                  ? "Course Management"
                  : activeTab === "notices"
                    ? "Notice Management"
                    : activeTab === "subjects"
                      ? "Subject Management"
                      : activeTab === "fees"
                        ? (user?.role === "STUDENT" ? "Fee Payments" : "Fee Management")
                        : activeTab === "student-payments"
                          ? "Student Payments"
                          : "Dashboard Overview"}
            </h1>
          </div>
        </header>

        {/* Content area */}
        <main
          className={`flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 ${
            activeTab === "dashboard" ? "flex items-center justify-center" : ""
          }`}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
