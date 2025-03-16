import { useRef, useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import { motion } from "motion/react";
import { IoMdArrowDropdown, IoMdClose, IoMdMenu } from "react-icons/io";
import { NavLink } from "react-router";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    {
      title: "Academics",
      children: ["Programs", "Time Table", "Notices"],
    },
    {
      title: "Administration",
      children: ["Admin Login", "Faculties"],
    },
    {
      title: "Campus Life",
      children: ["Cultural & Cosmopolitan", "Sports & Games", "Hostels"],
    },
    {
      title: "Student",
      children: ["Student Login"],
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (index: number | null) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-blue-900 text-white shadow-lg z-20" ref={navRef}>
      <div className="max-w-7xl mx-auto px-6   py-2">
        <div className="flex justify-between h-16">
          {/* Logo and College Name */}
          <NavLink to="/" className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center mr-2">
                <img src={Logo} alt="" />
              </div>
              <div className="flex flex-col sm:flex-row font-semibold text-md sm:text-xl">
                <span>Rajiv Memorial Institute&nbsp;</span>
                <span>Of Technology</span>
              </div>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link, index) => (
                <div key={index} className="relative">
                  <button
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 cursor-pointer"
                    onClick={() => toggleDropdown(index)}
                  >
                    {link.title}
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {link.children.map((child, childIndex) => (
                          <NavLink
                            key={childIndex}
                            to={child.toLowerCase().replace(" ", "")}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => toggleDropdown(null)}
                          >
                            {child}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <IoMdClose color="white" size={24} />
                ) : (
                  <IoMdMenu color="white" size={24} />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, index) => (
              <div key={index}>
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white"
                  onClick={() => toggleDropdown(index)}
                >
                  {link.title}
                  <IoMdArrowDropdown
                    className="float-right transition duration-300 ease-in-out"
                    color="white"
                    style={{
                      transform:
                        activeDropdown === index
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </button>
                {activeDropdown === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="pl-4 py-2 space-y-1"
                  >
                    {link.children.map((child, childIndex) => (
                      <NavLink
                        key={childIndex}
                        to={child.toLowerCase().replace(" ", "")}
                        className="block px-4 py-2 text-sm text-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
