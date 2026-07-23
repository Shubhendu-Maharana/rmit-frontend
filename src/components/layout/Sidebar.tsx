import { useState, useEffect } from "react";
import {
  FiLoader,
  FiLogOut,
  FiMenu,
  FiUsers,
  FiX,
  FiGrid,
  FiBookOpen,
  FiBell,
  FiBook,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { motion, AnimatePresence, Variants } from "motion/react";
import { useLogoutMutation } from "../../store/api/authApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../store/slices/authSlice";
import { RootState } from "../../store";

interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SideBar = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}: SideBarProps) => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: <FiGrid size={20} /> },
  ];

  if (user && user.role !== "STUDENT") {
    tabs.push({
      id: "users",
      name: "User Management",
      icon: <FiUsers size={20} />,
    });
  }

  if (user && user.role === "SUPER_ADMIN") {
    tabs.push({
      id: "courses",
      name: "Course Management",
      icon: <FiBookOpen size={20} />,
    });
  }

  if (user && user.role !== "STUDENT") {
    tabs.push({
      id: "subjects",
      name: "Subject Management",
      icon: <FiBook size={20} />,
    });
  }

  if (user) {
    tabs.push({
      id: "notices",
      name: "Notice Management",
      icon: <FiBell size={20} />,
    });
  }

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    if (isLoading) return;
    try {
      await logoutMutation().unwrap();
      toast.success("Logout successful");
      navigator("/adminlogin");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      navigator("/adminlogin");
    } finally {
      dispatch(clearCredentials());
    }
  };

  const sidebarVariants: Variants = {
    open: {
      width: isMobile ? "280px" : "260px",
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      width: isMobile ? "0px" : "80px",
      x: isMobile ? -280 : 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const itemVariants: Variants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      opacity: isMobile ? 0 : 1,
      x: isMobile ? -20 : 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const textVariants: Variants = {
    open: {
      opacity: 1,
      display: "block",
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 },
      transitionEnd: { display: "none" },
    },
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed lg:relative z-50 h-screen bg-linear-to-b from-primary-800 to-indigo-900 text-white shrink-0 shadow-2xl overflow-hidden flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <motion.div
            variants={textVariants}
            className="whitespace-nowrap font-bold text-xl tracking-wider"
          >
            ADMIN PANEL
          </motion.div>
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            >
              <FiX size={24} />
            </button>
          )}
        </div>

        <nav className="mt-8 flex-1">
          <div className="px-3 space-y-2">
            {tabs.map((tab) => (
              <motion.div
                key={tab.id}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                  activeTab === tab.id
                    ? "bg-white text-primary-800 shadow-lg"
                    : "hover:bg-white/10 text-white/80 hover:text-white"
                }`}
              >
                <div
                  className={`shrink-0 ${activeTab === tab.id ? "text-primary-800" : ""}`}
                >
                  {tab.icon}
                </div>
                <motion.span
                  variants={textVariants}
                  className="ml-4 font-medium whitespace-nowrap"
                >
                  {tab.name}
                </motion.span>
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-8 left-0 w-full px-3">
            <motion.div
              variants={itemVariants}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`flex items-center p-3 rounded-xl hover:bg-red-500/10 text-red-100 transition-all duration-200 ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-red-400"}`}
            >
              {isLoading ? (
                <div className="shrink-0">
                  <FiLoader size={20} />
                </div>
              ) : (
                <div className="shrink-0">
                  <FiLogOut size={20} />
                </div>
              )}
              <motion.span
                variants={textVariants}
                className="ml-4 font-medium whitespace-nowrap"
              >
                Logout
              </motion.span>
            </motion.div>
          </div>
        </nav>
      </motion.aside>
    </>
  );
};

export default SideBar;
