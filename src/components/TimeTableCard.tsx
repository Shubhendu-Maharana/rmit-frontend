import { IoDocumentText } from "react-icons/io5";

type Semester = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type ProgramType = "Degree" | "Diploma" | "ITI";

type Timetable = {
  id: string;
  program: string;
  program_type: ProgramType;
  semester: Semester;
  academic_year: string;
  last_updated: string;
  file_link: string;
};

// Get color for program type
const getProgramTypeColor = (type: ProgramType): string => {
  switch (type) {
    case "Degree":
      return "bg-primary-100 text-primary-800";
    case "Diploma":
      return "bg-purple-100 text-purple-800";
    case "ITI":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Format date to be more readable
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const TimetableCard = ({ timetable }: { timetable: Timetable }) => {
  const typeColor = getProgramTypeColor(timetable.program_type);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}
          >
            {timetable.program_type}
          </span>
          <span className="text-sm text-gray-500">
            Updated: {formatDate(timetable.last_updated)}
          </span>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-gray-800">
          {timetable.program}
        </h3>

        <div className="mt-2 flex items-center space-x-2 text-gray-600 text-sm">
          <span className="font-medium">Semester:</span>&nbsp;
          {timetable.semester}
        </div>

        <div className="mt-1 flex items-center space-x-2 text-gray-600 text-sm">
          <span className="font-medium">Academic Year:</span>{" "}
          {timetable.academic_year}
        </div>

        <a
          href={timetable.file_link}
          target="_blank"
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <IoDocumentText className="h-5 w-5 mr-2" />
          View Timetable
        </a>
      </div>
    </div>
  );
};

export default TimetableCard;
