import { memo } from "react";
import { FacultyCard as FacultyCardType } from "@app/types/dataTypes";

const FacultyCard = memo(
  ({
    faculty,
    openFacultyModal,
    getInstituteColor,
  }: {
    faculty: FacultyCardType;
    openFacultyModal: (faculty: FacultyCardType) => void;
    getInstituteColor: (department: string) => string;
  }) => {
    const departmentColor = getInstituteColor(faculty.instituteCode);

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
        <div className="relative">
          <img
            src={faculty.profile_photo_url || "https://picsum.photos/200"}
            alt={faculty.fullName}
            className="w-full h-56 object-cover object-center"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-bold text-lg">{faculty.fullName}</h3>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${departmentColor}`}
            >
              {faculty.instituteName}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3">
            <span className="font-medium">Designation:</span>{" "}
            {faculty.designation}
          </p>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => openFacultyModal(faculty)}
              className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-1.5 px-3 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    );
  },
);

FacultyCard.displayName = "FacultyCard";

export default FacultyCard;
