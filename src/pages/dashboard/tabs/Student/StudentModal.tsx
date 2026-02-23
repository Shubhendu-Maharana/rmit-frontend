import { useRef, useState } from "react";
import { motion } from "motion/react";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiBook,
  FiCalendar,
  FiMapPin,
  FiHash,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import { Student } from "@app/types/dataTypes";
import { toast } from "react-toastify";
import { addStudent, updateStudent } from "@services/student";
import supabase from "@services/supabase";

interface StudentModalProps {
  editMode: boolean;
  currentStudent: Student;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setCurrentStudent: (student: Student) => void;
  setShowModal: (modal: boolean) => void;
}

const StudentModal = ({
  editMode,
  currentStudent,
  setStudents,
  setCurrentStudent,
  setShowModal,
}: StudentModalProps) => {
  const [addEditLoading, setAddEditLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(
    currentStudent.image || "https://placehold.co/128x128",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const removeImage = () => {
    setImageUrl("https://placehold.co/128x128");
    setImageFile(null);
    const e = {
      target: { name: "image", value: "https://placehold.co/128x128" },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(e);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setUploadError("No file selected");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("student-images")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("student-images")
        .getPublicUrl(fileName);

      if (data && data.publicUrl) {
        setImageUrl(data.publicUrl);
        const e = {
          target: { name: "image", value: data.publicUrl },
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
        const data = await updateStudent(currentStudent);
        setStudents((prev) =>
          prev.map((m) => (m.id === currentStudent.id ? data : m)),
        );
        toast.success("Student updated successfully");
      } else {
        const data = await addStudent(currentStudent);
        setStudents((prev) => [...prev, data]);
        toast.success("Student added successfully");
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

    let finalValue: string | number = value;
    if (type === "number" || name === "semster") {
      finalValue = Number(value);
    }

    setCurrentStudent({ ...currentStudent, [name]: finalValue });
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
              {editMode ? "Edit Student" : "Add New Student"}
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
          {/* Top Section: Identity & Contact */}
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
                  value={currentStudent.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  <FiHash className="text-primary-500" /> Roll Number
                </label>
                <input
                  type="text"
                  name="roll_number"
                  value={currentStudent.roll_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                  placeholder="e.g. CS2025001"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  <FiUser className="text-primary-500" /> Gender
                </label>
                <select
                  name="gender"
                  value={currentStudent.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  <FiMail className="text-primary-500" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={currentStudent.email}
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
                  type="number"
                  name="phone"
                  value={currentStudent.phone || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                  placeholder="10 digit number"
                  required
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Middle Section: Academic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiBook className="text-primary-500" /> Department
              </label>
              <select
                name="department"
                value={currentStudent.department || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Business">Business</option>
                <option value="Engineering">Engineering</option>
                <option value="Arts & Science">Arts & Science</option>
                <option value="Medicine">Medicine</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiBook className="text-primary-500" /> Semester
              </label>
              <select
                name="semester"
                value={currentStudent.semester}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <CalendarIcon /> Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={currentStudent.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiCalendar className="text-primary-500" /> Admission Date
              </label>
              <input
                type="date"
                name="admission_date"
                value={currentStudent.admission_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                required
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Bottom Section: Guardian & Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiUser className="text-primary-500" /> Guardian Name
              </label>
              <input
                type="text"
                name="guardian_name"
                value={currentStudent.guardian_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                placeholder="e.g. Robert Doe"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiPhone className="text-primary-500" /> Guardian Phone
              </label>
              <input
                type="number"
                name="guardian_phone"
                value={currentStudent.guardian_phone || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                placeholder="10 digit number"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                <FiMapPin className="text-primary-500" /> Address
              </label>
              <input
                type="text"
                name="address"
                value={currentStudent.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                placeholder="Full residential address"
                required
              />
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
                  ? "Update Student"
                  : "Add Student"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const CalendarIcon = () => <FiCalendar className="text-primary-500" />;

export default StudentModal;
