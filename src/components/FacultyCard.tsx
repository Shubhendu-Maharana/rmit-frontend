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

const FacultyCard = ({
  faculty,
  openFacultyModal,
  getDepartmentColor,
}: {
  faculty: Faculty;
  openFacultyModal: (faculty: Faculty) => void;
  getDepartmentColor: (department: Department) => string;
}) => {
  const departmentColor = getDepartmentColor(faculty.department);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        {faculty.isHoD && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl-lg text-white">
            HOD
          </div>
        )}
        <img
          src={faculty.image}
          alt={faculty.name}
          className="w-full h-56 object-cover object-center"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{faculty.name}</h3>
          <p className="text-white/90 text-sm">{faculty.designation}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${departmentColor}`}
          >
            {faculty.department}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3">
          <span className="font-medium">Specialization:</span>{" "}
          {faculty.specialization}
        </p>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => openFacultyModal(faculty)}
            className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-1.5 px-3 rounded-md text-sm font-medium transition-colors duration-200"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
