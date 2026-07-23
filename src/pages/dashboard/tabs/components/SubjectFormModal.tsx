import React, { useState, useEffect } from "react";
import { FiX, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";
import { Course, Subject, User } from "../../../../types/dataTypes";

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  selectedSubject: Subject | null;
  createSubject: (payload: any) => { unwrap: () => Promise<any> };
  updateSubject: (args: { id: string; body: any }) => {
    unwrap: () => Promise<any>;
  };
  courses: Course[];
  currentUser: User | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isCreating: boolean;
  isUpdating: boolean;
}

export const SubjectFormModal: React.FC<SubjectFormModalProps> = ({
  isOpen,
  onClose,
  editMode,
  selectedSubject,
  createSubject,
  updateSubject,
  courses,
  currentUser,
  isSuperAdmin,
  isAdmin,
  isCreating,
  isUpdating,
}) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("3");
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("");
  const [courseId, setCourseId] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (editMode && selectedSubject) {
      setCode(selectedSubject.code);
      setName(selectedSubject.name);
      setCredits(selectedSubject.credits.toString());
      setSemester(selectedSubject.semester.toString());
      setAcademicYear(selectedSubject.academicYear);
      setCourseId(selectedSubject.courseId);
    } else {
      setCode("");
      setName("");
      setCredits("3");
      setSemester("1");
      setAcademicYear(new Date().getFullYear().toString());
      setCourseId("");
    }
  }, [isOpen, editMode, selectedSubject]);

  if (!isOpen) return null;

  // Filter courses available for user
  const allowedCourses = courses.filter((c) => {
    if (isSuperAdmin) return true;
    return c.institute === currentUser?.adminProfile?.institute;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !semester || !academicYear || !courseId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      code,
      name,
      credits: Number(credits),
      semester: Number(semester),
      academicYear,
      courseId,
    };

    // Access control checks
    const targetCourse = courses.find((c) => c.id === courseId);
    if (!isSuperAdmin) {
      if (!isAdmin) {
        toast.error("You are not authorized to manage subjects.");
        return;
      }
      if (
        !targetCourse ||
        targetCourse.institute !== currentUser?.adminProfile?.institute
      ) {
        toast.error(
          "Admins can only assign subjects to courses belonging to their own institute.",
        );
        return;
      }
    }

    try {
      if (editMode && selectedSubject) {
        await updateSubject({ id: selectedSubject.id, body: payload }).unwrap();
        toast.success("Subject updated successfully.");
      } else {
        await createSubject(payload).unwrap();
        toast.success("Subject created successfully.");
      }
      onClose();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Failed to process subject request.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {editMode
              ? "Modify Subject Profile"
              : "Register New Syllabus Subject"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                placeholder="e.g. CS101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Credits Value
              </label>
              <input
                type="number"
                placeholder="e.g. 3"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              placeholder="e.g. Introduction to Programming"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Semester Block
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem.toString()}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                placeholder="e.g. 2026"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Syllabus Course Path
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
              required
            >
              <option value="">Select Associated Course</option>
              {allowedCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.institute})
                </option>
              ))}
            </select>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 border-t border-gray-100 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-650 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-lg shadow-primary-200 disabled:opacity-50"
            >
              {isCreating || isUpdating ? (
                <>
                  <FiRefreshCw className="animate-spin" /> Saving...
                </>
              ) : (
                <span className="flex items-center gap-1">
                  <FiCheckCircle /> Save Subject
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
