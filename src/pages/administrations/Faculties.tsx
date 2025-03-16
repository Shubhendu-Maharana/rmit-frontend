import { useEffect, useState } from "react";
import FacultyModal from "../../components/FacultyModal";
import FacultyCard from "../../components/FacultyCard";

// Define TypeScript types for faculty data
type Department =
  | "Computer Science"
  | "Business"
  | "Engineering"
  | "Arts & Sciences"
  | "Medicine";
type Designation =
  | "Professor"
  | "Associate Professor"
  | "Assistant Professor"
  | "Lecturer"
  | "Visiting Faculty";

type Faculty = {
  id: string;
  name: string;
  image: string;
  designation: Designation;
  department: Department;
  specialization: string;
  email: string;
  phone: string;
  education: string[];
  isHoD: boolean;
};

const sampleFaculties: Faculty[] = [
  {
    id: "1",
    name: "Dr. Alice Johnson",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    designation: "Professor",
    department: "Computer Science",
    specialization: "Artificial Intelligence",
    email: "alice.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    education: [
      "Ph.D. in Computer Science, MIT",
      "M.S. in Artificial Intelligence, Stanford University",
      "B.Tech in Computer Science, IIT Delhi",
    ],
    isHoD: true,
  },
  {
    id: "1",
    name: "Dr. Alice Wordy",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    designation: "Professor",
    department: "Computer Science",
    specialization: "Artificial Intelligence",
    email: "alice.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    education: [
      "Ph.D. in Computer Science, MIT",
      "M.S. in Artificial Intelligence, Stanford University",
      "B.Tech in Computer Science, IIT Delhi",
    ],
    isHoD: false,
  },
  {
    id: "2",
    name: "Dr. Robert Smith",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    designation: "Associate Professor",
    department: "Business",
    specialization: "Marketing Analytics",
    email: "robert.smith@university.edu",
    phone: "+1 (555) 234-5678",
    education: [
      "Ph.D. in Business Administration, Harvard University",
      "MBA in Marketing, Wharton Business School",
      "BBA in Business Management, University of Chicago",
    ],
    isHoD: false,
  },
  {
    id: "3",
    name: "Dr. Emily Carter",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    designation: "Assistant Professor",
    department: "Engineering",
    specialization: "Structural Engineering",
    email: "emily.carter@university.edu",
    phone: "+1 (555) 345-6789",
    education: [
      "Ph.D. in Civil Engineering, University of California, Berkeley",
      "M.S. in Structural Engineering, Stanford University",
      "B.Tech in Civil Engineering, IIT Bombay",
    ],
    isHoD: true,
  },
  {
    id: "4",
    name: "Dr. James Anderson",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    designation: "Lecturer",
    department: "Arts & Sciences",
    specialization: "Philosophy",
    email: "james.anderson@university.edu",
    phone: "+1 (555) 456-7890",
    education: [
      "Ph.D. in Philosophy, University of Oxford",
      "M.A. in Ethics, University of Cambridge",
      "B.A. in Philosophy, Yale University",
    ],
    isHoD: false,
  },
  {
    id: "5",
    name: "Dr. Linda Thompson",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    designation: "Visiting Faculty",
    department: "Medicine",
    specialization: "Cardiology",
    email: "linda.thompson@university.edu",
    phone: "+1 (555) 567-8901",
    education: [
      "M.D. in Cardiology, Johns Hopkins University",
      "M.S. in Medical Sciences, Harvard Medical School",
      "B.Sc. in Biology, University of Toronto",
    ],
    isHoD: true,
  },
];

const Faculties = () => {
  // State for department filter
  const [activeDepartment, setActiveDepartment] = useState<Department | "All">(
    "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [filteredFaculties, setFilteredFaculties] = useState<Faculty[]>([]);

  // Department options
  const departments = [
    { id: "All", label: "All Departments" },
    { id: "Computer Science", label: "Computer Science" },
    { id: "Business", label: "Business" },
    { id: "Engineering", label: "Engineering" },
    { id: "Arts & Sciences", label: "Arts & Sciences" },
    { id: "Medicine", label: "Medicine" },
  ];

  // Filter faculties based on department
  useEffect(() => {
    if (activeDepartment === "All") {
      setFilteredFaculties(sampleFaculties);
    } else {
      setFilteredFaculties(
        sampleFaculties.filter(
          (faculty) => faculty.department === activeDepartment
        )
      );
    }
  }, [activeDepartment]);

  // Filter faculties based on search query
  useEffect(() => {
    const filtered = sampleFaculties.filter((faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFaculties(filtered);
  }, [searchQuery]);

  // Get department color based on department name
  const getDepartmentColor = (department: Department): string => {
    switch (department) {
      case "Computer Science":
        return "bg-blue-100 text-blue-800";
      case "Business":
        return "bg-amber-100 text-amber-800";
      case "Engineering":
        return "bg-green-100 text-green-800";
      case "Arts & Sciences":
        return "bg-purple-100 text-purple-800";
      case "Medicine":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openFacultyModal = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFaculty(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Our Faculty
          </h1>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Meet our distinguished faculty members who are experts in their
            fields and dedicated to academic excellence
          </p>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Search and filter section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <label htmlFor="faculty-search" className="sr-only">
                Search faculty
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="faculty-search"
                  name="faculty-search"
                  type="text"
                  placeholder="Search by name, specialization, or department"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  className={`px-3 py-1.5 rounded-md text-sm font-medium 
                    ${
                      activeDepartment === dept.id
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {/* This would normally map over filtered faculty data */}
          {filteredFaculties.map((faculty) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              openFacultyModal={openFacultyModal}
              getDepartmentColor={getDepartmentColor}
            />
          ))}
        </div>

        {/* Department sections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Faculty by Department
          </h2>

          <div className="space-y-8">
            {departments
              .filter((dept) => dept.id !== "All")
              .filter((dept) =>
                filteredFaculties.some(
                  (faculty) => faculty.department === dept.id && faculty.isHoD
                )
              )
              .map((dept) => (
                <div
                  key={dept.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {dept.label}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Our {dept.label} department consists of expert faculty
                      members dedicated to excellence in teaching and research.
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src="https://picsum.photos/500/500"
                          alt="Department Head"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {
                              filteredFaculties.find(
                                (faculty) =>
                                  faculty.department === dept.id &&
                                  faculty.isHoD
                              )?.name
                            }
                          </p>
                          <p className="text-gray-600 text-sm">
                            Department Head
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <span className="font-bold text-xl">
                            {
                              filteredFaculties.filter(
                                (faculty) => faculty.department === dept.id
                              ).length
                            }
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Faculty Members
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Faculty Profile Modal */}
        {isModalOpen && (
          <FacultyModal
            selectedFaculty={selectedFaculty}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            getDepartmentColor={getDepartmentColor}
          />
        )}
      </div>
    </div>
  );
};

export default Faculties;
