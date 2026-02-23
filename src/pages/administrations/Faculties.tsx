import { useEffect, useState } from "react";
import FacultyModal from "../../components/FacultyModal";
import FacultyCard from "../../components/FacultyCard";
import supabase from "../../supabase";
import Skeleton from "../../components/ui/Skeleton";
import { IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

type Department = "Degree" | "Diploma" | "ITI";

type Faculty = {
  id: string;
  name: string;
  image: string;
  department: Department;
  specialization: string;
  email: string;
  phone: string;
  education: string;
  is_hod: boolean;
  joining_date: string;
};

const Faculties = () => {
  const [faculties, setFaculties] = useState<Faculty[]>();
  const [activeDepartment, setActiveDepartment] = useState<Department | "All">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [filteredFaculties, setFilteredFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getFaculties = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from("faculty").select("*");
        if (error) {
          throw error;
        } else {
          setFaculties(data);
          setFilteredFaculties(data);
        }
      } catch (error) {
        console.error("Error fetching faculties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getFaculties();
  }, []);

  const departments = [
    { id: "All", label: "All Departments" },
    { id: "Degree", label: "Degree" },
    { id: "Diploma", label: "Diploma" },
    { id: "ITI", label: "ITI" },
  ];

  useEffect(() => {
    if (activeDepartment === "All") {
      setFilteredFaculties(faculties ?? []);
    } else {
      setFilteredFaculties(
        faculties?.filter(
          (faculty) => faculty.department === activeDepartment,
        ) ?? [],
      );
    }
  }, [activeDepartment]);

  useEffect(() => {
    const filtered = faculties?.filter((faculty) =>
      faculty.name.toLowerCase().startsWith(searchQuery.toLowerCase()),
    );
    setFilteredFaculties(filtered ?? []);
  }, [searchQuery]);

  const getDepartmentColor = (department: Department): string => {
    switch (department) {
      case "Degree":
        return "bg-primary-100 text-primary-800";
      case "Diploma":
        return "bg-amber-100 text-amber-800";
      case "ITI":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openFacultyModal = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-primary-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Our Faculty
          </h1>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Meet our distinguished faculty members who are experts in their
            fields and dedicated to academic excellence
          </p>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <label htmlFor="faculty-search" className="sr-only">
                Search faculty
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="faculty-search"
                  name="faculty-search"
                  type="text"
                  placeholder="Search by name, specialization, or department"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() =>
                    setActiveDepartment(dept.id as Department | "All")
                  }
                  className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer 
                    ${
                      activeDepartment === dept.id
                        ? "bg-primary-100 text-primary-800 border border-primary-300"
                        : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                    }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Faculty summary */}
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeDepartment === "All"
              ? "All Faculty"
              : `${activeDepartment} Faculty`}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredFaculties.length} faculty members
          </span>
        </div>

        {/* Faculty grid with placeholder cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        ) : filteredFaculties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              No faculty members found
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              We couldn't find any faculty members that match your search
              criteria.
            </p>
          </div>
        ) : (
          <motion.div
            key={activeDepartment}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredFaculties.map((faculty) => (
                <motion.div
                  key={faculty.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.95 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <FacultyCard
                    faculty={faculty}
                    openFacultyModal={openFacultyModal}
                    getDepartmentColor={getDepartmentColor}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Faculty Profile Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <FacultyModal
              selectedFaculty={selectedFaculty}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              getDepartmentColor={getDepartmentColor}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Faculties;
