import { useState } from "react";
import { FiBook, FiCalendar, FiLogOut, FiMenu, FiUsers } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "faculty", name: "Faculty", icon: <FiUsers size={20} /> },
  { id: "students", name: "Students", icon: <FiUsers size={20} /> },
  { id: "timetables", name: "Timetables", icon: <FiCalendar size={20} /> },
  { id: "notices", name: "Notices", icon: <FiBook size={20} /> },
];

const SideBar = ({ activeTab, setActiveTab }: SideBarProps) => {
  const navigator = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 768 ? true : false
  );

  const { signOut } = useAuth();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      navigator("/adminlogin");
    }
  };

  return (
    <div
      className={`bg-gradient-to-b from-primary-700 to-indigo-800 text-white ${
        sidebarOpen ? "w-64" : "w-14"
      } flex-shrink-0 transition-all duration-300`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h2 className="text-xl font-bold">Admin Portal</h2>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white"
        >
          <FiMenu size={24} />
        </button>
      </div>
      <nav className="mt-8">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center py-3 px-4 hover:bg-primary-600 cursor-pointer ${
              activeTab === tab.id ? "bg-primary-600" : ""
            }`}
          >
            {tab.icon}
            {sidebarOpen && <span className="ml-4">{tab.name}</span>}
          </a>
        ))}
        <div className="pt-8">
          <button
            onClick={handleLogout}
            className="flex w-full items-center py-3 px-4
          hover:bg-primary-600 cursor-pointer"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
