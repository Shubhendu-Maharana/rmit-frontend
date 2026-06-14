import { memo } from "react";
import { MdEmail, MdPhone, MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import { FacultyCard as FacultyCardType } from "@app/types/dataTypes";

type FacultyModalProps = {
  selectedFaculty: FacultyCardType | null;
  isModalOpen: boolean;
  closeModal: () => void;
  getInstituteColor: (department: string) => string;
};

const FacultyModal = memo(
  ({ selectedFaculty, closeModal, getInstituteColor }: FacultyModalProps) => {
    if (!selectedFaculty) return null;

    const instituteColor = getInstituteColor(selectedFaculty.instituteCode);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Background overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer"
          >
            <MdClose className="text-xl" />
          </button>

          {/* Header with image */}
          <div className="relative">
            <div className="h-32 sm:h-48 w-full bg-linear-to-r from-primary-600 to-indigo-700"></div>
            <div className="absolute top-16 sm:top-24 left-0 w-full flex justify-center">
              <div className="relative">
                <img
                  src={
                    selectedFaculty.profile_photo_url ||
                    "https://picsum.photos/200"
                  }
                  alt={selectedFaculty.fullName}
                  className="h-32 w-32 sm:h-48 sm:w-48 rounded-full object-cover border-4 border-white shadow-xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Faculty details */}
          <div className="pt-20 sm:pt-28 pb-6 sm:pb-8 px-4 sm:px-8">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {selectedFaculty.fullName}
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs sm:text-sm font-medium ${instituteColor}`}
              >
                {selectedFaculty.instituteName}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
              {/* Left column */}
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <h4 className="text-md sm:text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center">
                    <span className="w-1.5 h-6 bg-primary-500 rounded-full mr-2"></span>
                    Designation
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {selectedFaculty.designation}
                  </p>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <h4 className="text-md sm:text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-2"></span>
                    Contact Info
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center group">
                      <div className="p-2 bg-primary-50 text-primary-600 rounded-lg mr-3 group-hover:bg-primary-100 transition-colors">
                        <MdEmail className="text-lg" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                          Email
                        </p>
                        <p className="text-gray-700 text-sm sm:text-base truncate">
                          {selectedFaculty.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center group">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mr-3 group-hover:bg-emerald-100 transition-colors">
                        <MdPhone className="text-lg" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                          Phone
                        </p>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {selectedFaculty.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  },
);

FacultyModal.displayName = "FacultyModal";

export default FacultyModal;
