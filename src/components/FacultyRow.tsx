import { motion } from "motion/react";
import { FiCalendar, FiEdit, FiMail, FiPhone, FiTrash2 } from "react-icons/fi";

type Department = "Degree" | "Diploma" | "ITI" | "";

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

type FacultyRowProps = {
  member: Faculty;
  handleEditFaculty: (member: Faculty) => void;
  handleDeleteFaculty: (id: string) => void;
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const FacultyRow = ({
  member,
  handleEditFaculty,
  handleDeleteFaculty,
}: FacultyRowProps) => {
  return (
    <motion.div
      key={member.id}
      variants={itemVariants}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary-200 transition-all group relative"
    >
      <div className="flex items-start gap-4">
        <img
          src={member.image}
          alt={member.name}
          className="w-20 h-20 rounded-2xl object-cover shadow-md"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
              {member.department}
            </span>
            <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEditFaculty(member)}
                className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg"
              >
                <FiEdit size={16} />
              </button>
              <button
                onClick={() => handleDeleteFaculty(member.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mt-2 flex items-center gap-2">
            {member.name}
            {member.is_hod && (
              <span className="bg-primary-700 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                HOD
              </span>
            )}
          </h3>
          <p className="text-sm font-medium text-primary-600 truncate">
            {member.specialization}
          </p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">
            {member.education}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-1 gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FiMail size={14} />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FiPhone size={14} />
          <span>{member.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FiCalendar size={14} />
          <span>
            Joined {new Date(member.joining_date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FacultyRow;
