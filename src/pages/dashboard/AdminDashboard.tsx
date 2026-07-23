import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import FacultyTab from "./tabs/Faculty/FacultyTab";
import StudentTab from "./tabs/Student/StudentTab";
import NoticesTab from "./tabs/Notice/NoticesTab";
import TimetablesTab from "./tabs/Timetable/TimetablesTab";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

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

            {activeTab === "students" && <StudentTab />}

            {activeTab === "notices" && <NoticesTab />}

            {activeTab === "timetables" && <TimetablesTab />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
