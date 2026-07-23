import React, { useState, useEffect } from "react";
import { FiX, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";
import { Institute, Course } from "../../../../types/dataTypes";

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  selectedCourse: Course | null;
  createCourse: (payload: any) => { unwrap: () => Promise<any> };
  updateCourse: (args: { id: string; body: any }) => {
    unwrap: () => Promise<any>;
  };
  isCreating: boolean;
  isUpdating: boolean;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  editMode,
  selectedCourse,
  createCourse,
  updateCourse,
  isCreating,
  isUpdating,
}) => {
  const [name, setName] = useState("");
  const [institute, setInstitute] = useState<Institute | "">("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (editMode && selectedCourse) {
      setName(selectedCourse.name);
      setInstitute(selectedCourse.institute);
      setDescription(selectedCourse.description || "");
    } else {
      setName("");
      setInstitute("");
      setDescription("");
    }
  }, [isOpen, editMode, selectedCourse]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Course name is required.");
      return;
    }
    if (!institute) {
      toast.error("Institution allocation is required.");
      return;
    }

    const payload = {
      name,
      institute,
      description: description || null,
    };

    try {
      if (editMode && selectedCourse) {
        await updateCourse({ id: selectedCourse.id, body: payload }).unwrap();
        toast.success("Course updated successfully.");
      } else {
        await createCourse(payload).unwrap();
        toast.success("Course created successfully.");
      }
      onClose();
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to process course action.";
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
              ? "Modify Course Specifications"
              : "Register New Syllabus Course"}
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Course Title Name
            </label>
            <input
              type="text"
              placeholder="e.g. Bachelor of Computer Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Academic Institute Allocation
            </label>
            <select
              value={institute}
              onChange={(e) => setInstitute(e.target.value as Institute)}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
              required
            >
              <option value="">Select Institute</option>
              <option value="RMIT">RMIT (Graduation Courses)</option>
              <option value="RMITC">RMITC (ITI / Trade Courses)</option>
              <option value="HIT">HIT (Diploma Courses)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description / Syllabus Overview
            </label>
            <textarea
              placeholder="Provide a description of the course contents and objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
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
                  <FiCheckCircle /> Save Course
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
