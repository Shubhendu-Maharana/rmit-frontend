import React, { useState } from "react";
import { FiCheckCircle, FiUser, FiLayers, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";
import { Course, User } from "../../../../types/dataTypes";
import { FeeStructure } from "../../../../store/api/feeApi";

interface FeeAssignmentPanelProps {
  feeStructures: FeeStructure[];
  courses: Course[];
  students: User[];
  assignFee: (payload: any) => { unwrap: () => Promise<any> };
  isAssigning: boolean;
  isSuperAdmin: boolean;
  currentUser: any;
}

export const FeeAssignmentPanel: React.FC<FeeAssignmentPanelProps> = ({
  feeStructures,
  courses,
  students,
  assignFee,
  isAssigning,
  isSuperAdmin,
  currentUser,
}) => {
  const [feeStructureId, setFeeStructureId] = useState("");
  const [assignType, setAssignType] = useState<"ALL" | "INDIVIDUAL">("ALL");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("1");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");

  const filteredFeeStructures = feeStructures.filter((fs) => {
    if (isSuperAdmin) return true;
    return fs.course?.institute === currentUser?.adminProfile?.institute;
  });

  const allowedCourses = courses.filter((c) => {
    if (isSuperAdmin) return true;
    return c.institute === currentUser?.adminProfile?.institute;
  });

  const searchedStudents = students.filter((s) => {
    const profile = s.studentProfile;
    if (!isSuperAdmin && profile?.institute !== currentUser?.adminProfile?.institute) {
      return false;
    }
    const nameStr = profile?.name || "";
    const emailStr = s.email || "";
    const rollStr = s.rollNumber || "";
    const term = studentSearchTerm.toLowerCase();
    return (
      term &&
      (nameStr.toLowerCase().includes(term) ||
        emailStr.toLowerCase().includes(term) ||
        rollStr.toLowerCase().includes(term))
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeStructureId) {
      toast.error("Please select a fee structure to assign.");
      return;
    }

    const payload: any = {
      feeStructureId,
      assignType,
    };

    if (assignType === "INDIVIDUAL") {
      if (!selectedStudentId) {
        toast.error("Please select an individual student profile.");
        return;
      }
      payload.studentId = selectedStudentId;
    } else {
      if (!courseId || !semester) {
        toast.error("Please select both course and semester for bulk assignment.");
        return;
      }
      payload.courseId = courseId;
      payload.semester = Number(semester);
    }

    try {
      const response = await assignFee(payload).unwrap();
      const count = response.data?.count || 0;
      toast.success(`Fee structure assigned successfully to ${count} student(s).`);
      setSelectedStudentId("");
      setStudentSearchTerm("");
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to assign fee.";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div>
        <h3 className="font-bold text-gray-800 text-base">Fee Allocation Workspace</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Assign a global fee structure to students in bulk or individually.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Fee Structure */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Choose Fee Structure
          </label>
          <select
            value={feeStructureId}
            onChange={(e) => setFeeStructureId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
            required
          >
            <option value="">Select Structure</option>
            {filteredFeeStructures.map((fs) => (
              <option key={fs.id} value={fs.id}>
                {fs.title} (₹{fs.amount.toLocaleString()} - {fs.course?.name} Sem {fs.semester})
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Assignment Mode */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Allocation Mode
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAssignType("ALL")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                assignType === "ALL"
                  ? "bg-primary-50 border-primary-300 text-primary-700 shadow-sm"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FiLayers />
              <span>Bulk Semester Allocation</span>
            </button>
            <button
              type="button"
              onClick={() => setAssignType("INDIVIDUAL")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                assignType === "INDIVIDUAL"
                  ? "bg-primary-50 border-primary-300 text-primary-700 shadow-sm"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FiUser />
              <span>Individual Student Profile</span>
            </button>
          </div>
        </div>

        {/* Bulk Fields */}
        {assignType === "ALL" && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-gray-750 mb-1">
                Select Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                required={assignType === "ALL"}
              >
                <option value="">Select Course</option>
                {allowedCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.institute})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-750 mb-1">
                Semester Block
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                required={assignType === "ALL"}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem.toString()}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Individual Fields */}
        {assignType === "INDIVIDUAL" && (
          <div className="space-y-3 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-gray-750 mb-1">
                Search Student Profile
              </label>
              <input
                type="text"
                placeholder="Search by student name, roll number, or email..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            {searchedStudents.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 max-h-40 overflow-y-auto divide-y divide-gray-150">
                {searchedStudents.map((stud) => (
                  <div
                    key={stud.id}
                    onClick={() => {
                      setSelectedStudentId(stud.studentProfile?.id || "");
                      setStudentSearchTerm(stud.studentProfile?.name || "");
                    }}
                    className={`p-3 text-xs flex items-center justify-between cursor-pointer transition-colors hover:bg-primary-50/50 ${
                      selectedStudentId === stud.studentProfile?.id
                        ? "bg-primary-50 font-bold text-primary-700"
                        : "text-gray-700"
                    }`}
                  >
                    <div>
                      <div>{stud.studentProfile?.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Roll: {stud.rollNumber} | {stud.email}
                      </div>
                    </div>
                    {selectedStudentId === stud.studentProfile?.id && (
                      <FiCheckCircle className="text-primary-600" size={14} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isAssigning}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-primary-200 disabled:opacity-50"
          >
            {isAssigning ? (
              <>
                <FiRefreshCw className="animate-spin" /> Allocating...
              </>
            ) : (
              <>
                <FiCheckCircle /> Confirm Fee Allocation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
