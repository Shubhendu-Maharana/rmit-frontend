import React, { useState, useEffect } from "react";
import {
  FiX,
  FiCheck,
  FiUploadCloud,
  FiUser,
  FiArrowLeft,
  FiArrowRight,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { Role, Institute, Gender, User } from "../../../../types/dataTypes";

interface FormState {
  email: string;
  rollNumber: string;
  password?: string;
  role: Role;
  name: string;
  gender: Gender | "";
  institute: Institute | "";
  photo: string;
  department: string;
  designation: string;
  courseId: string;
  joiningDate: string;
  experienceYears: string;
  employmentType: string;
  phone: string;
  address: string;
  year: string;
  semester: string;
  section: string;
  batch: string;
  tenthMarksheetUrl: string;
  twelfthMarksheetUrl: string;
  identityProofUrl: string;
  resumeUrl: string;
  joiningLetterUrl: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
}

const initialFormState: FormState = {
  email: "",
  rollNumber: "",
  password: "",
  role: "STUDENT",
  name: "",
  gender: "",
  institute: "",
  photo: "",
  department: "",
  designation: "",
  courseId: "",
  joiningDate: "",
  experienceYears: "",
  employmentType: "Full-Time",
  phone: "",
  address: "",
  year: "1",
  semester: "1",
  section: "",
  batch: "",
  tenthMarksheetUrl: "",
  twelfthMarksheetUrl: "",
  identityProofUrl: "",
  resumeUrl: "",
  joiningLetterUrl: "",
  dateOfBirth: "",
  guardianName: "",
  guardianPhone: "",
};

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  selectedUser: User | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  currentUser: any;
  coursesData: any;
  createUser: (payload: any) => { unwrap: () => Promise<any> };
  updateUser: (args: { id: string; body: any }) => {
    unwrap: () => Promise<any>;
  };
  uploadFile: (formData: FormData) => { unwrap: () => Promise<any> };
  isCreating: boolean;
  isUpdating: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  editMode,
  selectedUser,
  isSuperAdmin,
  isAdmin,
  currentUser,
  coursesData,
  createUser,
  updateUser,
  uploadFile,
  isCreating,
  isUpdating,
}) => {
  const [formStep, setFormStep] = useState(1);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // File Upload State
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(
    null,
  );
  const [selectedJoiningLetterFile, setSelectedJoiningLetterFile] =
    useState<File | null>(null);
  const [selectedTenthMarksheetFile, setSelectedTenthMarksheetFile] =
    useState<File | null>(null);
  const [selectedTwelfthMarksheetFile, setSelectedTwelfthMarksheetFile] =
    useState<File | null>(null);
  const [selectedIdentityProofFile, setSelectedIdentityProofFile] =
    useState<File | null>(null);

  // Reset or Populate form on open/change of selectedUser
  useEffect(() => {
    if (!isOpen) return;

    if (editMode && selectedUser) {
      const profile =
        selectedUser.superAdminProfile ||
        selectedUser.adminProfile ||
        selectedUser.facultyProfile ||
        selectedUser.studentProfile;

      setFormState({
        email: selectedUser.email || "",
        rollNumber: selectedUser.rollNumber || "",
        password: "",
        role: selectedUser.role,
        name: profile?.name || "",
        gender: profile?.gender || "",
        institute:
          selectedUser.role === "SUPER_ADMIN"
            ? ""
            : selectedUser.adminProfile?.institute ||
              selectedUser.facultyProfile?.institute ||
              selectedUser.studentProfile?.institute ||
              "",
        photo: profile?.photo || "",
        department: selectedUser.facultyProfile?.department || "",
        designation: selectedUser.facultyProfile?.designation || "",
        courseId:
          selectedUser.facultyProfile?.courseId ||
          selectedUser.studentProfile?.courseId ||
          "",
        joiningDate: selectedUser.facultyProfile?.joiningDate
          ? new Date(selectedUser.facultyProfile.joiningDate)
              .toISOString()
              .split("T")[0]
          : "",
        experienceYears:
          selectedUser.facultyProfile?.experienceYears?.toString() || "",
        employmentType:
          selectedUser.facultyProfile?.employmentType || "Full-Time",
        phone: selectedUser.facultyProfile?.phone || "",
        address:
          selectedUser.facultyProfile?.address ||
          selectedUser.studentProfile?.address ||
          "",
        year: selectedUser.studentProfile?.year?.toString() || "1",
        semester: selectedUser.studentProfile?.semester?.toString() || "1",
        section: selectedUser.studentProfile?.section || "",
        batch: selectedUser.studentProfile?.batch || "",
        tenthMarksheetUrl: selectedUser.studentProfile?.tenthMarksheetUrl || "",
        twelfthMarksheetUrl:
          selectedUser.studentProfile?.twelfthMarksheetUrl || "",
        identityProofUrl: selectedUser.studentProfile?.identityProofUrl || "",
        resumeUrl: selectedUser.facultyProfile?.resumeUrl || "",
        joiningLetterUrl: selectedUser.facultyProfile?.joiningLetterUrl || "",
        dateOfBirth: selectedUser.studentProfile?.dateOfBirth
          ? new Date(selectedUser.studentProfile.dateOfBirth)
              .toISOString()
              .split("T")[0]
          : "",
        guardianName: selectedUser.studentProfile?.guardianName || "",
        guardianPhone: selectedUser.studentProfile?.guardianPhone || "",
      });
    } else {
      setFormState({
        ...initialFormState,
        institute:
          currentUser?.role === "ADMIN"
            ? currentUser.adminProfile?.institute || ""
            : "",
      });
    }

    setFormStep(1);
    setSelectedPhotoFile(null);
    setPhotoPreview("");
    setSelectedResumeFile(null);
    setSelectedJoiningLetterFile(null);
    setSelectedTenthMarksheetFile(null);
    setSelectedTwelfthMarksheetFile(null);
    setSelectedIdentityProofFile(null);
  }, [isOpen, editMode, selectedUser, currentUser]);

  if (!isOpen) return null;

  const allowedRolesToCreate: Role[] = isSuperAdmin
    ? ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"]
    : ["FACULTY", "STUDENT"];

  const filteredCourses =
    coursesData?.data?.filter(
      (c: any) => c.institute === formState.institute,
    ) || [];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB.");
      return;
    }

    setSelectedPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof FormState,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB.");
      return;
    }

    if (fieldName === "resumeUrl") {
      setSelectedResumeFile(file);
    } else if (fieldName === "joiningLetterUrl") {
      setSelectedJoiningLetterFile(file);
    } else if (fieldName === "tenthMarksheetUrl") {
      setSelectedTenthMarksheetFile(file);
    } else if (fieldName === "twelfthMarksheetUrl") {
      setSelectedTwelfthMarksheetFile(file);
    } else if (fieldName === "identityProofUrl") {
      setSelectedIdentityProofFile(file);
    }
  };

  const validateStep = () => {
    if (formStep === 1) {
      if (!editMode && formState.role === "STUDENT" && !formState.rollNumber) {
        toast.error("Roll Number is required for students.");
        return false;
      }
      if (!editMode && formState.role !== "STUDENT" && !formState.email) {
        toast.error("Email is required for staff/admins.");
        return false;
      }
      if (!editMode && !formState.password) {
        toast.error("Password is required for new accounts.");
        return false;
      }
      return true;
    }
    if (formStep === 2) {
      if (!formState.name) {
        toast.error("Name is required.");
        return false;
      }
      if (!formState.gender) {
        toast.error("Gender selection is required.");
        return false;
      }
      if (formState.role !== "SUPER_ADMIN" && !formState.institute) {
        toast.error("Institute selection is required.");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setFormStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setFormStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    const isLastStep =
      (formStep === 2 && formState.role === "SUPER_ADMIN") ||
      (formStep === 2 && formState.role === "ADMIN") ||
      formStep === 4;

    if (!isLastStep) {
      handleNextStep();
      return;
    }

    if (!isSuperAdmin) {
      if (!isAdmin) {
        toast.error("You are not authorized to create or modify users.");
        return;
      }
      if (formState.role !== "FACULTY" && formState.role !== "STUDENT") {
        toast.error(
          "Admins are only allowed to manage Faculty and Student users.",
        );
        return;
      }
      formState.institute = currentUser?.adminProfile?.institute || "";
      if (!formState.institute) {
        toast.error("Admin institute profile not found. Operation aborted.");
        return;
      }
    }

    let uploadedPhotoUrl = formState.photo;
    let uploadedResumeUrl = formState.resumeUrl;
    let uploadedJoiningLetterUrl = formState.joiningLetterUrl;
    let uploadedTenthMarksheetUrl = formState.tenthMarksheetUrl;
    let uploadedTwelfthMarksheetUrl = formState.twelfthMarksheetUrl;
    let uploadedIdentityProofUrl = formState.identityProofUrl;

    if (selectedPhotoFile) {
      setUploadingField("photo");
      const formData = new FormData();
      formData.append("file", selectedPhotoFile);
      try {
        const response = await uploadFile(formData).unwrap();
        uploadedPhotoUrl = response.data.url;
        toast.success("Profile photo uploaded successfully.");
      } catch (error: any) {
        const msg = error?.data?.message || "Profile photo upload failed";
        toast.error(msg);
        setUploadingField(null);
        return;
      }
      setUploadingField(null);
    }

    if (selectedResumeFile) {
      setUploadingField("resumeUrl");
      const formData = new FormData();
      formData.append("file", selectedResumeFile);
      try {
        const response = await uploadFile(formData).unwrap();
        uploadedResumeUrl = response.data.url;
        toast.success("Resume uploaded successfully.");
      } catch (error: any) {
        const msg = error?.data?.message || "Resume upload failed";
        toast.error(msg);
        setUploadingField(null);
        return;
      }
      setUploadingField(null);
    }

    if (selectedJoiningLetterFile) {
      setUploadingField("joiningLetterUrl");
      const formData = new FormData();
      formData.append("file", selectedJoiningLetterFile);
      try {
        const response = await uploadFile(formData).unwrap();
        uploadedJoiningLetterUrl = response.data.url;
        toast.success("Hiring Appointment Letter uploaded successfully.");
      } catch (error: any) {
        const msg =
          error?.data?.message || "Hiring Appointment Letter upload failed";
        toast.error(msg);
        setUploadingField(null);
        return;
      }
      setUploadingField(null);
    }

    if (selectedTenthMarksheetFile) {
      setUploadingField("tenthMarksheetUrl");
      const formData = new FormData();
      formData.append("file", selectedTenthMarksheetFile);
      try {
        const response = await uploadFile(formData).unwrap();
        uploadedTenthMarksheetUrl = response.data.url;
        toast.success("10th Grade Marksheet uploaded successfully.");
      } catch (error: any) {
        const msg = error?.data?.message || "10th Marksheet upload failed";
        toast.error(msg);
        setUploadingField(null);
        return;
      }
      setUploadingField(null);
    }

    if (selectedTwelfthMarksheetFile) {
      setUploadingField("twelfthMarksheetUrl");
      const formData = new FormData();
      formData.append("file", selectedTwelfthMarksheetFile);
      try {
        const response = await uploadFile(formData).unwrap();
        uploadedTwelfthMarksheetUrl = response.data.url;
        toast.success("12th Grade Marksheet uploaded successfully.");
      } catch (error: any) {
        const msg = error?.data?.message || "12th Marksheet upload failed";
        toast.error(msg);
        setUploadingField(null);
        return;
      }
      setUploadingField(null);
    }

    if (selectedIdentityProofFile) {
      setUploadingField("identityProofUrl");
      const formData = new FormData();
      formData.append("file", selectedIdentityProofFile);
      try {
        const response = await uploadFile(formData).unwrap();
        uploadedIdentityProofUrl = response.data.url;
        toast.success("Identity Proof uploaded successfully.");
      } catch (error: any) {
        const msg = error?.data?.message || "Identity Proof upload failed";
        toast.error(msg);
        setUploadingField(null);
        return;
      }
      setUploadingField(null);
    }

    const profilePayload: any = {
      name: formState.name,
      gender: formState.gender,
    };

    if (formState.role !== "SUPER_ADMIN") {
      profilePayload.institute = formState.institute;
    }

    if (uploadedPhotoUrl) {
      profilePayload.photo = uploadedPhotoUrl;
    }

    if (formState.role === "FACULTY") {
      profilePayload.department = formState.department || undefined;
      profilePayload.designation = formState.designation || undefined;
      profilePayload.courseId = formState.courseId || undefined;
      profilePayload.joiningDate = formState.joiningDate
        ? new Date(formState.joiningDate).toISOString()
        : undefined;
      profilePayload.experienceYears = formState.experienceYears
        ? Number(formState.experienceYears)
        : undefined;
      profilePayload.employmentType = formState.employmentType;
      profilePayload.phone = formState.phone || undefined;
      profilePayload.address = formState.address || undefined;
      profilePayload.resumeUrl = uploadedResumeUrl || undefined;
      profilePayload.joiningLetterUrl = uploadedJoiningLetterUrl || undefined;
    } else if (formState.role === "STUDENT") {
      profilePayload.courseId = formState.courseId || undefined;
      profilePayload.year = formState.year ? Number(formState.year) : undefined;
      profilePayload.semester = formState.semester
        ? Number(formState.semester)
        : undefined;
      profilePayload.section = formState.section || undefined;
      profilePayload.batch = formState.batch || undefined;
      profilePayload.dateOfBirth = formState.dateOfBirth
        ? new Date(formState.dateOfBirth).toISOString()
        : undefined;
      profilePayload.address = formState.address || undefined;
      profilePayload.guardianName = formState.guardianName || undefined;
      profilePayload.guardianPhone = formState.guardianPhone || undefined;
      profilePayload.tenthMarksheetUrl = uploadedTenthMarksheetUrl || undefined;
      profilePayload.twelfthMarksheetUrl =
        uploadedTwelfthMarksheetUrl || undefined;
      profilePayload.identityProofUrl = uploadedIdentityProofUrl || undefined;
    }

    const payload: any = {
      role: formState.role,
      profile: profilePayload,
    };

    if (!editMode) {
      payload.password = formState.password;
      if (formState.role === "STUDENT") {
        payload.rollNumber = formState.rollNumber;
      } else {
        payload.email = formState.email;
      }
    } else if (formState.password) {
      payload.password = formState.password;
    }

    try {
      if (editMode && selectedUser) {
        await updateUser({ id: selectedUser.id, body: payload }).unwrap();
        toast.success("User updated successfully.");
      } else {
        await createUser(payload).unwrap();
        toast.success("User and profile created successfully.");
      }
      onClose();
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to process user operation.";
      toast.error(msg);
    }
  };

  const renderStepHeader = () => {
    const steps = [
      { num: 1, label: "Account Setup" },
      { num: 2, label: "Basic Details" },
    ];
    if (formState.role === "FACULTY" || formState.role === "STUDENT") {
      steps.push({ num: 3, label: "Role Parameters" });
      steps.push({ num: 4, label: "Documents Upload" });
    }

    return (
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  formStep === s.num
                    ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                    : formStep > s.num
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {formStep > s.num ? <FiCheck /> : s.num}
              </span>
              <span
                className={`text-xs md:text-sm font-medium hidden sm:inline ${
                  formStep === s.num
                    ? "text-primary-700 font-bold"
                    : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 bg-gray-200 transition-all duration-300 ${
                  formStep > s.num ? "bg-emerald-400" : ""
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {editMode ? "Modify Profile" : "Register New User Account"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 flex-1 flex flex-col justify-between"
        >
          <div>
            {renderStepHeader()}

            {/* STEP 1: Account Setup */}
            {formStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    System User Role Type
                  </label>
                  <select
                    disabled={editMode}
                    value={formState.role}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        role: e.target.value as Role,
                        rollNumber: "",
                        email: "",
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:bg-gray-100 cursor-pointer"
                  >
                    {allowedRolesToCreate.map((role) => (
                      <option key={role} value={role}>
                        {role.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {formState.role !== "STUDENT" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled={editMode}
                      placeholder="user@rmit.edu"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:bg-gray-100"
                    />
                  </div>
                )}

                {formState.role === "STUDENT" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      disabled={editMode}
                      placeholder="e.g. RMIT2026001"
                      value={formState.rollNumber}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          rollNumber: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:bg-gray-100"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {editMode
                      ? "Reset Account Password (leave empty to keep unchanged)"
                      : "Account Security Password"}
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters recommended"
                    value={formState.password || ""}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Basic Details */}
            {formStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Profile Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Alan Turing or John Doe"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formState.gender}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        gender: e.target.value as Gender,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {formState.role !== "SUPER_ADMIN" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Academic Institute Allocation
                    </label>
                    <select
                      disabled={!isSuperAdmin || editMode}
                      value={formState.institute}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          institute: e.target.value as Institute,
                          courseId: "",
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:bg-gray-100 cursor-pointer"
                    >
                      <option value="">Select Institute</option>
                      <option value="RMIT">RMIT (Graduation Courses)</option>
                      <option value="RMITC">RMITC (ITI / Trade Courses)</option>
                      <option value="HIT">HIT (Diploma Courses)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Profile Image Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {photoPreview || formState.photo ? (
                      <img
                        src={photoPreview || formState.photo}
                        alt="Preview"
                        className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 shrink-0 select-none">
                        <FiUser
                          size={18}
                          className="text-gray-400 leading-none"
                        />
                        <span className="text-[8px] font-bold mt-0.5 tracking-wider uppercase leading-none">
                          No Photo
                        </span>
                      </div>
                    )}
                    {selectedPhotoFile ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-semibold shrink-0 shadow-sm">
                        <span
                          className="truncate max-w-[120px]"
                          title={selectedPhotoFile.name}
                        >
                          {selectedPhotoFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPhotoFile(null);
                            setPhotoPreview("");
                          }}
                          className="p-0.5 hover:bg-primary-100 text-primary-500 hover:text-primary-700 rounded-full transition-colors cursor-pointer"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="relative flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-250 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                        <FiUploadCloud size={16} />
                        <span>Choose Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Role Parameters */}
            {formStep === 3 && (
              <div className="space-y-4">
                {formState.role === "FACULTY" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={formState.department}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Professor / Asst. Professor"
                        value={formState.designation}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            designation: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Associated Course
                      </label>
                      <select
                        value={formState.courseId}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            courseId: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                      >
                        <option value="">Select Course (Optional)</option>
                        {filteredCourses.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Employment Hiring Type
                      </label>
                      <select
                        value={formState.employmentType}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            employmentType: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        value={formState.joiningDate}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            joiningDate: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        value={formState.experienceYears}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            experienceYears: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +61412345678"
                        value={formState.phone}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 123 University St"
                        value={formState.address}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                )}

                {formState.role === "STUDENT" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Enrollment Course
                      </label>
                      <select
                        value={formState.courseId}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            courseId: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                      >
                        <option value="">Select Course</option>
                        {filteredCourses.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Academic Year
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1"
                        value={formState.year}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            year: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Current Semester
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1"
                        value={formState.semester}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            semester: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Section
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. A"
                        value={formState.section}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            section: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Batch
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2026-2029"
                        value={formState.batch}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            batch: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formState.dateOfBirth}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Guardian Name
                      </label>
                      <input
                        type="text"
                        placeholder="Guardian Name"
                        value={formState.guardianName}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            guardianName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Guardian Phone
                      </label>
                      <input
                        type="text"
                        placeholder="Guardian Phone No"
                        value={formState.guardianPhone}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            guardianPhone: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Documents Upload */}
            {formStep === 4 && (
              <div className="space-y-6">
                {formState.role === "FACULTY" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Resume PDF
                      </label>
                      <div className="flex items-center gap-4">
                        {selectedResumeFile ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-semibold shrink-0 shadow-sm">
                            <span
                              className="truncate max-w-[150px]"
                              title={selectedResumeFile.name}
                            >
                              {selectedResumeFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedResumeFile(null)}
                              className="p-0.5 hover:bg-primary-100 text-primary-500 hover:text-primary-700 rounded-full transition-colors cursor-pointer"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ) : (
                          <label className="relative flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-250 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                            <FiUploadCloud size={16} />
                            <span>Choose Resume</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) =>
                                handleDocumentChange(e, "resumeUrl")
                              }
                              className="hidden"
                            />
                          </label>
                        )}
                        {formState.resumeUrl && !selectedResumeFile && (
                          <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                            <FiCheckCircle /> Existing Uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Hiring Appointment Letter
                      </label>
                      <div className="flex items-center gap-4">
                        {selectedJoiningLetterFile ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-semibold shrink-0 shadow-sm">
                            <span
                              className="truncate max-w-[150px]"
                              title={selectedJoiningLetterFile.name}
                            >
                              {selectedJoiningLetterFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedJoiningLetterFile(null)}
                              className="p-0.5 hover:bg-primary-100 text-primary-500 hover:text-primary-700 rounded-full transition-colors cursor-pointer"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ) : (
                          <label className="relative flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-250 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                            <FiUploadCloud size={16} />
                            <span>Choose Letter</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) =>
                                handleDocumentChange(e, "joiningLetterUrl")
                              }
                              className="hidden"
                            />
                          </label>
                        )}
                        {formState.joiningLetterUrl &&
                          !selectedJoiningLetterFile && (
                            <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                              <FiCheckCircle /> Existing Uploaded
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                )}

                {formState.role === "STUDENT" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        10th Grade Marksheet
                      </label>
                      <div className="flex items-center gap-4">
                        {selectedTenthMarksheetFile ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-semibold shrink-0 shadow-sm">
                            <span
                              className="truncate max-w-[150px]"
                              title={selectedTenthMarksheetFile.name}
                            >
                              {selectedTenthMarksheetFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedTenthMarksheetFile(null)
                              }
                              className="p-0.5 hover:bg-primary-100 text-primary-500 hover:text-primary-700 rounded-full transition-colors cursor-pointer"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ) : (
                          <label className="relative flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-250 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                            <FiUploadCloud size={16} />
                            <span>Choose 10th Marksheet</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={(e) =>
                                handleDocumentChange(e, "tenthMarksheetUrl")
                              }
                              className="hidden"
                            />
                          </label>
                        )}
                        {formState.tenthMarksheetUrl &&
                          !selectedTenthMarksheetFile && (
                            <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                              <FiCheckCircle /> Existing Uploaded
                            </span>
                          )}
                      </div>
                    </div>

                    {formState.institute === "RMIT" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          12th Grade Marksheet
                        </label>
                        <div className="flex items-center gap-4">
                          {selectedTwelfthMarksheetFile ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-semibold shrink-0 shadow-sm">
                              <span
                                className="truncate max-w-[150px]"
                                title={selectedTwelfthMarksheetFile.name}
                              >
                                {selectedTwelfthMarksheetFile.name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedTwelfthMarksheetFile(null)
                                }
                                className="p-0.5 hover:bg-primary-100 text-primary-500 hover:text-primary-700 rounded-full transition-colors cursor-pointer"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ) : (
                            <label className="relative flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-250 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                              <FiUploadCloud size={16} />
                              <span>Choose 12th Marksheet</span>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                onChange={(e) =>
                                  handleDocumentChange(e, "twelfthMarksheetUrl")
                                }
                                className="hidden"
                              />
                            </label>
                          )}
                          {formState.twelfthMarksheetUrl &&
                            !selectedTwelfthMarksheetFile && (
                              <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                                <FiCheckCircle /> Existing Uploaded
                              </span>
                            )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Identity Proof Attachment
                      </label>
                      <div className="flex items-center gap-4">
                        {selectedIdentityProofFile ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-semibold shrink-0 shadow-sm">
                            <span
                              className="truncate max-w-[150px]"
                              title={selectedIdentityProofFile.name}
                            >
                              {selectedIdentityProofFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedIdentityProofFile(null)}
                              className="p-0.5 hover:bg-primary-100 text-primary-500 hover:text-primary-700 rounded-full transition-colors cursor-pointer"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ) : (
                          <label className="relative flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-250 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                            <FiUploadCloud size={16} />
                            <span>Choose Proof</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={(e) =>
                                handleDocumentChange(e, "identityProofUrl")
                              }
                              className="hidden"
                            />
                          </label>
                        )}
                        {formState.identityProofUrl &&
                          !selectedIdentityProofFile && (
                            <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                              <FiCheckCircle /> Existing Uploaded
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="mt-8 border-t border-gray-100 pt-4 flex justify-between">
            {formStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <FiArrowLeft /> Back
              </button>
            ) : (
              <div />
            )}

            {(() => {
              const isLastStep =
                (formStep === 2 && formState.role === "SUPER_ADMIN") ||
                (formStep === 2 && formState.role === "ADMIN") ||
                formStep === 4;

              return isLastStep ? (
                <button
                  key="save-btn"
                  type="submit"
                  disabled={isCreating || isUpdating || !!uploadingField}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-lg shadow-primary-200 disabled:opacity-50"
                >
                  {isCreating || isUpdating || !!uploadingField ? (
                    <>
                      <FiRefreshCw className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              ) : (
                <button
                  key="next-btn"
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-lg shadow-primary-200"
                >
                  Next <FiArrowRight />
                </button>
              );
            })()}
          </div>
        </form>
      </div>
    </div>
  );
};
