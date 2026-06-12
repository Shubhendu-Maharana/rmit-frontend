import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  FiX,
  FiUpload,
  FiTrash2,
  FiUser,
  FiMail,
  FiPhone,
  FiBook,
  FiBriefcase,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";
import { Faculty } from "@app/types/dataTypes";
import { createFaculty, updateFaculty } from "@services/faculty";
import { toast } from "react-toastify";
import { uploadFile } from "@services/fileUpload";

interface FacultyModalProps {
  editMode: boolean;
  currentFaculty: Faculty;
  setFaculty: React.Dispatch<React.SetStateAction<Faculty[]>>;
  setCurrentFaculty: (faculty: Faculty) => void;
  setShowModal: (modal: boolean) => void;
}

const FacultyModal = ({
  editMode,
  currentFaculty,
  setFaculty,
  setCurrentFaculty,
  setShowModal,
}: FacultyModalProps) => {
  const [imageUrl, setImageUrl] = useState<string>(
    currentFaculty.image || "https://placehold.co/128x128",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addEditLoading, setAddEditLoading] = useState(false);

  const handleUpload = async () => {
    if (!imageFile) {
      setUploadError("No file selected");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const publicUrlData = await uploadFile({
        file: imageFile,
        bucket: "faculty-images",
      });

      if (publicUrlData) {
        setImageUrl(publicUrlData);
        const e = {
          target: { name: "image", value: publicUrlData },
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(e);
      }
    } catch (error) {
      const message = (error as Error)?.message || "Failed to upload image";
      toast.error(message);
    } finally {
      setIsUploading(false);
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddEditLoading(true);
      if (editMode) {
        await updateFaculty(currentFaculty);
        setFaculty((prev) =>
          prev.map((m) => (m.id === currentFaculty.id ? currentFaculty : m)),
        );
        toast.success("Faculty member updated successfully");
      } else {
        const data = await createFaculty(currentFaculty);
        setFaculty((prev) => [...prev, data]);
        toast.success("Faculty member added successfully");
      }
      setShowModal(false);
    } catch (error) {
      const message = (error as Error)?.message || "Failed to submit form";
      toast.error(message);
    } finally {
      setAddEditLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement;
    const finalValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setCurrentFaculty({ ...currentFaculty, [name]: finalValue });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const removeImage = () => {
    setImageUrl("https://placehold.co/128x128");
    setImageFile(null);
    const e = {
      target: { name: "image", value: "https://placehold.co/128x128" },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 bg-primary-600 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">
              {editMode ? "Edit Faculty Member" : "Add New Faculty Member"}
            </h3>
            <p className="text-primary-100 text-sm mt-0.5">
              Please fill in the details below
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar"
        >
          {/* Top Section: Photo & Identity */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 space-y-4">
              <div className="relative group mx-auto md:mx-0 w-40 h-40">
                <img
                  src={imageUrl}
                  alt="Faculty preview"
                  className="w-full h-full rounded-3xl object-cover ring-4 ring-gray-50 shadow-xl"
                />
                <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform"
                  >
                    <FiUpload size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {imageFile && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full py-2 bg-primary-50 text-primary-600 rounded-xl border border-primary-200 text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-100 transition-colors shadow-sm"
                >
                  {isUploading ? "Uploading..." : "Save Photo"}
                </button>
              )}
              {uploadError && (
                <p className="text-red-500 text-xs text-center">
                  {uploadError}
                </p>
              )}
              <p className="text-[10px] text-gray-400 text-center md:text-left leading-relaxed">
                Recommended: Square image (512x512px). Max 2MB.
              </p>
            </div>

            <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  <FiUser className="text-primary-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentFaculty.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                  placeholder="e.g. Dr. John Doe"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  <FiMail className="text-primary-500" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={currentFaculty.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  <FiPhone className="text-primary-500" /> Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={currentFaculty.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Bottom Section: Professional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiBook className="text-primary-500" /> Education
              </label>
              <input
                type="text"
                name="education"
                value={currentFaculty.education}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                placeholder="e.g. Ph.D. in Computer Science"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiBriefcase className="text-primary-500" /> Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={currentFaculty.specialization}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                placeholder="e.g. Machine Learning"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiBriefcase className="text-primary-500" /> Department
              </label>
              <select
                name="department"
                value={currentFaculty.department}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                required
              >
                <option value="">Select Department</option>
                <option value="Degree">Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="ITI">ITI</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiCalendar className="text-primary-500" /> Joining Date
              </label>
              <input
                type="date"
                name="joining_date"
                value={currentFaculty.joining_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${currentFaculty.is_hod ? "bg-primary-100 text-primary-600" : "bg-gray-200 text-gray-500"}`}
                  >
                    <FiCheck size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">
                      Head of Department
                    </span>
                    <span className="text-xs text-gray-500">
                      Check if this member leads the department
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="is_hod"
                  checked={currentFaculty.is_hod}
                  onChange={handleInputChange}
                  className="w-6 h-6 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 sticky bottom-[-29px] shadow-[0_-20px_20px_-20px_rgba(0,0,0,0.1)] bg-white pb-0">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-8 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 cursor-pointer ${addEditLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={addEditLoading}
            >
              {addEditLoading
                ? "Saving..."
                : editMode
                  ? "Update Faculty"
                  : "Add Faculty Member"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default FacultyModal;
