import { MdEmail, MdPhone } from "react-icons/md";

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

type FacultyModalProps = {
  selectedFaculty: Faculty | null;
  isModalOpen: boolean;
  closeModal: () => void;
  getDepartmentColor: (department: Department) => string;
};

const FacultyModal = ({
  isModalOpen,
  selectedFaculty,
  closeModal,
  getDepartmentColor,
}: FacultyModalProps) => {
  if (!selectedFaculty) return null;

  const departmentColor = getDepartmentColor(selectedFaculty.department);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        isModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/50"
          onClick={closeModal}
          aria-hidden="true"
        ></div>

        {/* Modal position helper */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header with image */}
          <div className="relative">
            <div className="h-48 w-full bg-gradient-to-r from-primary-600 to-indigo-700"></div>
            <div className="absolute top-24 left-0 w-full flex justify-center">
              <img
                src={selectedFaculty.image}
                alt={selectedFaculty.name}
                className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                loading="lazy"
              />
            </div>
          </div>

          {/* Faculty details */}
          <div className="pt-32 pb-8 px-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedFaculty.name}
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium ${departmentColor}`}
              >
                {selectedFaculty.department}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Left column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                    Specialization
                  </h4>
                  <p className="text-gray-700">
                    {selectedFaculty.specialization}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                    Education
                  </h4>
                  <p className="text-gray-700">{selectedFaculty.education}</p>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MdEmail className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-gray-700">{selectedFaculty.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MdPhone className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="text-gray-700">{selectedFaculty.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex justify-center">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyModal;
