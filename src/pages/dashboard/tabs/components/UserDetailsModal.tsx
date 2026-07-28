import React from "react";
import {
  FiX,
  FiUser,
  FiFileText,
  FiPhone,
  FiUploadCloud,
  FiCalendar,
} from "react-icons/fi";
import { User } from "../../../../types/dataTypes";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen || !user) return null;

  const profile =
    user.superAdminProfile ||
    user.adminProfile ||
    user.facultyProfile ||
    user.studentProfile;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        {/* Header Banner */}
        <div className="relative h-32 bg-gradient-to-r from-primary-600 to-indigo-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Profile Summary Circle */}
        <div className="px-6 pb-6 relative flex-1">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-6">
            <div className="relative -mt-16 z-10 shrink-0">
              {profile?.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  loading="lazy"
                  className="w-28 h-28 rounded-2xl border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl border-4 border-white bg-gradient-to-br from-primary-400 to-indigo-500 text-white flex items-center justify-center font-bold text-4xl shadow-lg">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left pb-1">
              <h3 className="text-2xl font-bold text-gray-800">
                {profile?.name || "N/A"}
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-primary-100 text-primary-700 rounded-full inline-block mt-1">
                {user.role.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Dynamic Profiles Detail Form grids */}
          <div className="space-y-6 text-gray-700">
            {/* Account Details Block */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                <FiUser className="text-primary-500" /> Account Security
                Credentials
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-gray-400 block mb-0.5">
                    Account ID:
                  </span>
                  <span className="text-gray-700 font-mono">{user.id}</span>
                </div>
                {user.email && (
                  <div>
                    <span className="text-gray-400 block mb-0.5">
                      Linked Email Address:
                    </span>
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                )}
                {user.rollNumber && (
                  <div>
                    <span className="text-gray-400 block mb-0.5">
                      Student Roll Number:
                    </span>
                    <span className="text-gray-700 font-mono font-bold">
                      {user.rollNumber}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400 block mb-0.5">Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                      user.isDeleted
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {user.isDeleted
                      ? "DEACTIVATED / DELETED"
                      : "ACTIVE / VALID"}
                  </span>
                </div>
              </div>
            </div>

            {/* Faculty Specific Profile */}
            {user.role === "FACULTY" && user.facultyProfile && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-gray-150">
                  <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <FiFileText className="text-primary-500" /> Academic &
                    Department Parameters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Institute:
                      </span>
                      <span className="text-gray-700">
                        {user.facultyProfile.institute || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Department Name:
                      </span>
                      <span className="text-gray-700">
                        {user.facultyProfile.department || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Professional Designation:
                      </span>
                      <span className="text-gray-700">
                        {user.facultyProfile.designation || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Head of Department (HOD):
                      </span>
                      <span className="text-gray-700">
                        {user.facultyProfile.isHod ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Experience (Years):
                      </span>
                      <span className="text-gray-700">
                        {user.facultyProfile.experienceYears ?? "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Hiring Mode:
                      </span>
                      <span className="text-gray-700">
                        {user.facultyProfile.employmentType || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Joining Date:
                      </span>
                      <span className="text-gray-700">
                        {user.facultyProfile.joiningDate
                          ? new Date(
                              user.facultyProfile.joiningDate,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-150">
                  <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <FiPhone className="text-primary-500" /> Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Phone Number:
                      </span>
                      <span className="text-gray-700">
                        {user.facultyProfile.phone || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Residential Address:
                      </span>
                      <span className="text-gray-700">
                        {user.facultyProfile.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Faculty Documents */}
                {(user.facultyProfile.resumeUrl ||
                  user.facultyProfile.joiningLetterUrl) && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-150">
                    <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                      <FiUploadCloud className="text-primary-500" /> HR & Hiring
                      Documents
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {user.facultyProfile.resumeUrl && (
                        <a
                          href={user.facultyProfile.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <FiFileText /> View Resume PDF
                        </a>
                      )}
                      {user.facultyProfile.joiningLetterUrl && (
                        <a
                          href={user.facultyProfile.joiningLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <FiFileText /> View Joining Letter
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Student Specific Profile */}
            {user.role === "STUDENT" && user.studentProfile && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-gray-150">
                  <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <FiFileText className="text-primary-500" /> Academic
                    Standing & Placement
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Institute:
                      </span>
                      <span className="text-gray-700">
                        {user.studentProfile.institute || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Current Semester / Year:
                      </span>
                      <span className="text-gray-700">
                        Sem {user.studentProfile.semester ?? "N/A"} / Year{" "}
                        {user.studentProfile.year ?? "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Section / Batch:
                      </span>
                      <span className="text-gray-700">
                        Section {user.studentProfile.section || "N/A"} (Batch:{" "}
                        {user.studentProfile.batch || "N/A"})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Academic Status:
                      </span>
                      <span className="text-gray-700">
                        {user.studentProfile.academicStatus || "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-150">
                  <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <FiCalendar className="text-primary-500" /> Personal Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Date of Birth:
                      </span>
                      <span className="text-gray-700">
                        {user.studentProfile.dateOfBirth
                          ? new Date(
                              user.studentProfile.dateOfBirth,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Guardian Contact Name:
                      </span>
                      <span className="text-gray-700">
                        {user.studentProfile.guardianName || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Guardian Phone:
                      </span>
                      <span className="text-gray-700">
                        {user.studentProfile.guardianPhone || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">
                        Home Address:
                      </span>
                      <span className="text-gray-700">
                        {user.studentProfile.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Student Documents */}
                {(user.studentProfile.tenthMarksheetUrl ||
                  user.studentProfile.twelfthMarksheetUrl ||
                  user.studentProfile.identityProofUrl) && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-150">
                    <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                      <FiUploadCloud className="text-primary-500" /> Submitted
                      Admission Documents
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {user.studentProfile.tenthMarksheetUrl && (
                        <a
                          href={user.studentProfile.tenthMarksheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <FiFileText /> 10th Marksheet PDF
                        </a>
                      )}
                      {user.studentProfile.twelfthMarksheetUrl && (
                        <a
                          href={user.studentProfile.twelfthMarksheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <FiFileText /> 12th Marksheet PDF
                        </a>
                      )}
                      {user.studentProfile.identityProofUrl && (
                        <a
                          href={user.studentProfile.identityProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <FiFileText /> Identity Proof
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
