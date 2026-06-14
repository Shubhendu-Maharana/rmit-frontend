import { useEffect, useState, useMemo, useCallback } from "react";
import FacultyModal from "../../components/FacultyModal";
import FacultyCard from "../../components/FacultyCard";
import Skeleton from "../../components/ui/Skeleton";
import { IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import type { FacultyCard as FacultyCardType } from "@app/types/dataTypes";
import { getFaculties } from "@services/faculty";

const institues = [
  { label: "All", value: "ALL" },
  { label: "Degree", value: "RMIT" },
  { label: "Diploma", value: "HIT" },
  { label: "ITI", value: "RMITC" },
];

const getInstituteColor = (instituteCode: string): string => {
  switch (instituteCode) {
    case "RMIT":
      return "bg-primary-100 text-primary-800";
    case "HIT":
      return "bg-amber-100 text-amber-800";
    case "RMITC":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Faculties = () => {
  const [faculties, setFaculties] = useState<FacultyCardType[]>([]);
  const [activeDepartment, setActiveDepartment] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] =
    useState<FacultyCardType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setIsLoading(true);
        const data = await getFaculties();
        setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaculties();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setDebouncedQuery("");
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredFaculties = useMemo(() => {
    if (!faculties) return [];

    return faculties.filter((faculty) => {
      // 1. Department/Institute filter
      const matchesDepartment =
        activeDepartment === "ALL" ||
        faculty.instituteCode === activeDepartment;

      // 2. Search name
      const matchesName = faculty.fullName
        .toLowerCase()
        .startsWith(debouncedQuery);

      return matchesDepartment && matchesName;
    });
  }, [faculties, activeDepartment, debouncedQuery]);

  const openFacultyModal = useCallback((faculty: FacultyCardType) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-linear-to-r from-primary-700 to-indigo-800 text-white py-16">
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
            <div className="grow">
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
              {institues.map((institute) => (
                <button
                  key={institute.value}
                  onClick={() => setActiveDepartment(institute.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer 
                    ${
                      activeDepartment === institute.value
                        ? "bg-primary-100 text-primary-800 border border-primary-300"
                        : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                    }`}
                >
                  {institute.label}
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
                    getInstituteColor={getInstituteColor}
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
              getInstituteColor={getInstituteColor}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Faculties;
