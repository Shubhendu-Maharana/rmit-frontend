# RMIT Backend System - API Documentation

This document describes all API endpoints exposed by the RMIT College Management System Backend.

---

## Base Configuration

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **Authentication**: Stateless JWT token. Delivered either via `Authorization: Bearer <TOKEN>` header or `token` cookie.

---

## Common Enumerations

### 1. `Role`

- `SUPER_ADMIN`
- `ADMIN`
- `FACULTY`
- `STUDENT`

### 2. `Institute`

- `RMIT` (Graduation Courses)
- `RMITC` (Industrial Trade / ITI Courses)
- `HIT` (Diploma Courses)

### 3. `Gender`

- `MALE`
- `FEMALE`
- `OTHER`

---

## Auth Endpoints (`/api/auth`)

### 1. User Login

Authenticates any role using either email or student roll number.

- **Route**: `POST /api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```ts
  {
    email?: string;       // Required if rollNumber is missing
    rollNumber?: string;  // Required if email is missing (e.g. for Students)
    password: string;     // Required
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "uuid-string",
        "email": "user@rmit.edu",
        "rollNumber": null,
        "role": "FACULTY",
        "createdAt": "2026-07-22T12:00:00.000Z",
        "facultyProfile": {
          "id": "uuid-string",
          "name": "Prof. Alan Turing",
          "phone": "+61412345678"
        }
      }
    },
    "timestamp": "2026-07-22T12:00:00.000Z"
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid credentials.
  - `403 Forbidden`: Account soft-deleted (`isDeleted: true`).

### 2. User Logout

Clears the HTTP-only token cookie.

- **Route**: `POST /api/auth/logout`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## Health Check Endpoint (`/api/health`)

Monitors system health, uptime, and database connectivity.

### 1. System Health Status
- **Route**: `GET /api/health`
- **Headers**: None (Public endpoint)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "System health status retrieved successfully",
    "data": {
      "status": "UP",
      "uptime": 142.84, // Process uptime in seconds
      "timestamp": "2026-07-23T18:51:52.000Z",
      "database": "CONNECTED" // "CONNECTED" or error message details
    }
  }
  ```

---

## User Management Endpoints (`/api/users`)

### 1. Retrieve Self Profile

- **Route**: `GET /api/users/me`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK)**:
  Returns details of the currently authenticated user session.
  ```json
  {
    "success": true,
    "message": "User details retrieved successfully",
    "data": {
      "id": "uuid-string",
      "email": "user@rmit.edu",
      "rollNumber": null,
      "role": "FACULTY",
      "createdAt": "2026-07-22T12:00:00.000Z",
      "facultyProfile": { ... }
    }
  }
  ```

### 2. Create User Profile

Creates credentials and inserts the corresponding profile.

- **Route**: `POST /api/users`
- **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` and `ADMIN` authorized)
- **Request Body**:
  ```ts
  {
    email?: string;       // Mandatory for non-students
    rollNumber?: string;  // Mandatory for students
    password: string;     // Mandatory
    role: Role;           // Mandatory. Admin can only create FACULTY or STUDENT.
    profile?: {           // Optional
      name?: string;      // Defaults to email prefix or roll number
      gender?: Gender;
      institute?: Institute; // Admin's institute is auto-assigned
      // Faculty specific:
      department?: string;
      designation?: string;
      courseId?: string;   // Must refer to a valid course matching the user's institute
      resumeUrl?: string;
      joiningLetterUrl?: string;
      qualificationCerts?: string[];
      qualification?: string;
      experienceYears?: number;
      employmentType?: string;
      phone?: string;
      address?: string;
      // Student specific:
      courseId?: string;   // Must refer to a valid course matching the user's institute
      year?: number;
      semester?: number;
      section?: string;
      batch?: string;
      tenthMarksheetUrl?: string;
      twelfthMarksheetUrl?: string;
      identityProofUrl?: string;
    }
  }
  ```
- **Validation Rules**:
  - **Institute**: Admins can only create users in their own institute.
  - **Course**: If `courseId` is supplied, the course must exist in the database, and its institute must match the user's institute.
  - **Marksheets**:
    - Graduation students (`RMIT`) require both `tenthMarksheetUrl` and `twelfthMarksheetUrl` if marksheets are submitted.
    - Diploma (`HIT`) and ITI (`RMITC`) students require `tenthMarksheetUrl`.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User and profile created successfully",
    "data": {
      "user": { ... },
      "profile": { ... }
    }
  }
  ```

### 3. List Users

Retrieves users matching permission scopes.

- **Route**: `GET /api/users`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Query Parameters** (All optional, case-insensitive):
  - `role`: Filter by role (`SUPER_ADMIN`, `ADMIN`, etc.)
  - `institute`: Filter by institute (`RMIT`, `RMITC`, `HIT`)
  - `includeDeleted`: `true` (Only valid for `SUPER_ADMIN`)
  - `search`: Keyword string. Searches case-insensitively across `email`, `rollNumber`, and all profile `name` fields.
- **Access Scope**:
  - `STUDENT`: Blocked entirely (`403`).
  - `FACULTY`: Can only view Faculty & Students in their own institute.
  - `ADMIN`: Can view Admins, Faculty, & Students in their own institute.
  - `SUPER_ADMIN`: Can view all users globally.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Users retrieved successfully",
    "data": [
      {
        "id": "uuid-string",
        "email": "faculty@rmit.edu",
        "role": "FACULTY",
        "facultyProfile": { ... }
      }
    ]
  }
  ```

### 4. Get User by ID

- **Route**: `GET /api/users/:id`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Access Scope**:
  - `STUDENT`: Can only fetch their own ID. Others return `403`.
  - `FACULTY`: Can only fetch Faculty & Students in their own institute. Others return `403`.
  - `ADMIN`: Can only fetch users in their own institute (excluding Super Admins).
  - `SUPER_ADMIN`: Can fetch any ID.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User details retrieved successfully",
    "data": { ... }
  }
  ```

### 5. Update User Profile

- **Route**: `PATCH /api/users/:id`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
  Accepts any credentials or profile properties.
- **Access Scope**:
  - **Super Admin**: Can update any user and modify any fields.
  - **Admin**: Can update Faculty and Students in their own institute. Cannot change user roles to Admin/Super Admin or transfer users between institutes.
  - **Self-Update** (Any user): Can only modify their own `name`, `photo`, `gender`, `phone`, `address`, and `password`. Modifying administrative fields (`role`, `institute`, `isHod`, `department`, `course`, `year`, `semester`, etc.) is blocked (`403`).
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "user": { ... },
      "profile": { ... }
    }
  }
  ```

### 6. Delete User Profile (Soft Delete)

Deactivates user and hides their profile from listings.

- **Route**: `DELETE /api/users/:id`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Access Scope**:
  - `SUPER_ADMIN`: Can delete any user (except self).
  - `ADMIN`: Can delete Faculty & Students in their own institute.
  - Others: Blocked (`403`).
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

### 7. Restore User Profile

Reverts soft deletion.

- **Route**: `PATCH /api/users/:id/restore`
- **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` authorized)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User restored successfully",
    "data": {
      "id": "uuid-string",
      "email": "faculty@rmit.edu",
      "role": "FACULTY",
      "isDeleted": false,
      "facultyProfile": { ... }
    }
  }
  ```

---

## File Upload Endpoints (`/api/upload`)

### 1. Upload File

Uploads images or document attachments.

- **Route**: `POST /api/upload`
- **Headers**:
  - `Authorization: Bearer <TOKEN>`
  - `Content-Type: multipart/form-data`
- **Form-data Field**: `file` (single file input)
- **Validation Rules**:
  - Maximum file size: **5MB**.
  - Allowed Formats:
    - Images: `.jpg`, `.jpeg`, `.png`, `.webp` (allowed for all profiles).
    - Documents: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx` (only allowed for Faculty & Students).
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "File uploaded successfully",
    "data": {
      "fileName": "1784739281729-resume.pdf",
      "fileUrl": "/uploads/1784739281729-resume.pdf",
      "provider": "LOCAL"
    },
    "timestamp": "2026-07-22T12:00:00.000Z"
  }
  ```

---

## Course Management Endpoints (`/api/courses`)

All course management mutation endpoints are strictly restricted to `SUPER_ADMIN` to manage the globally available courses list. Reading endpoints are accessible to all authenticated users.

### 1. Create Course

- **Route**: `POST /api/courses`
- **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` authorized)
- **Request Body**:
  ```ts
  {
    name: string;        // Unique course identifier (e.g., "BCA", "Civil Engineering")
    description?: string;// Optional course details
    institute: Institute;// RMIT, RMITC, or HIT
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Course created successfully",
    "data": {
      "id": "uuid-string",
      "name": "BCA",
      "description": "Bachelor of Computer Applications",
      "institute": "RMIT",
      "createdAt": "2026-07-22T18:00:00.000Z",
      "updatedAt": "2026-07-22T18:00:00.000Z"
    }
  }
  ```

### 2. List Courses

- **Route**: `GET /api/courses`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Query Parameters** (Optional):
  - `institute`: Filter by institute (`RMIT`, `RMITC`, `HIT`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Courses retrieved successfully",
    "data": [
      {
        "id": "uuid-string",
        "name": "BCA",
        "description": "Bachelor of Computer Applications",
        "institute": "RMIT"
      }
    ]
  }
  ```

### 3. Get Course by ID

- **Route**: `GET /api/courses/:id`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Course details retrieved successfully",
    "data": {
      "id": "uuid-string",
      "name": "BCA",
      "description": "Bachelor of Computer Applications",
      "institute": "RMIT"
    }
  }
  ```

### 4. Update Course

- **Route**: `PATCH /api/courses/:id`
- **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` authorized)
- **Request Body**:
  ```ts
  {
    name?: string;
    description?: string;
    institute?: Institute;
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Course updated successfully",
    "data": {
      "id": "uuid-string",
      "name": "BCA",
      "description": "Updated description",
      "institute": "RMIT"
    }
  }
  ```

### 5. Delete Course

- **Route**: `DELETE /api/courses/:id`
- **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` authorized)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Course deleted successfully"
  }
  ```

---

## Notice Management Endpoints (`/api/notices`)

Notices represent information updates published for public site visitors. Reading notices is public; creating, updating, and deleting notices are restricted to `SUPER_ADMIN` and `ADMIN` roles.

### 1. Create Notice
* **Route**: `POST /api/notices`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` and `ADMIN` authorized)
* **Request Body**:
  ```ts
  {
    title: string;        // Title of the notice
    fileUrl: string;      // URL/path to the notice document
    institute?: Institute;// Optional for Super Admin. For Admin, it is auto-assigned to their institute.
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Notice created successfully",
    "data": {
      "id": "uuid-string",
      "title": "Semester Registration Deadline Extended",
      "fileUrl": "/uploads/1784739281729-notice.pdf",
      "institute": "RMIT",
      "createdAt": "2026-07-23T00:00:00.000Z",
      "updatedAt": "2026-07-23T00:00:00.000Z"
    }
  }
  ```

### 2. List Notices
* **Route**: `GET /api/notices`
* **Headers**: None required (Public endpoint)
* **Query Parameters** (Optional):
  - `institute`: Filter by institute (`RMIT`, `RMITC`, `HIT`). If provided, returns both institute-specific notices and global (null) notices.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Notices retrieved successfully",
    "data": [
      {
        "id": "uuid-string",
        "title": "General Holiday Notice",
        "fileUrl": "/uploads/1784739281729-holiday.pdf",
        "institute": null
      }
    ]
  }
  ```

### 3. Get Notice by ID
* **Route**: `GET /api/notices/:id`
* **Headers**: None required (Public endpoint)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Notice details retrieved successfully",
    "data": {
      "id": "uuid-string",
      "title": "General Holiday Notice",
      "fileUrl": "/uploads/1784739281729-holiday.pdf",
      "institute": null
    }
  }
  ```

### 4. Update Notice
* **Route**: `PATCH /api/notices/:id`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` and `ADMIN` authorized)
* **Request Body**:
  ```ts
  {
    title?: string;
    fileUrl?: string;
    institute?: Institute | null; // Admins cannot set this to an institute other than their own.
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Notice updated successfully",
    "data": {
      "id": "uuid-string",
      "title": "Updated Holiday Notice",
      "fileUrl": "/uploads/1784739281729-holiday.pdf",
      "institute": null
    }
  }
  ```

### 5. Delete Notice
* **Route**: `DELETE /api/notices/:id`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` and `ADMIN` authorized)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Notice deleted successfully"
  }
  ```

---

## Subject Management Endpoints (`/api/subjects`)

Subjects define the syllabus for courses in a specific semester and academic year. Creating/updating subjects is restricted to `SUPER_ADMIN` and `ADMIN` roles.

### 1. Create Subject
* **Route**: `POST /api/subjects`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` and `ADMIN` authorized)
* **Request Body**:
  ```ts
  {
    code: string;         // Unique subject code for the year (e.g. "BCA-101")
    name: string;         // Subject name (e.g., "Mathematics-I")
    credits?: number;     // Subject credits (defaults to 3)
    semester: number;     // Semester index (e.g. 1)
    academicYear: string; // The academic year session (e.g., "2026-2027")
    courseId: string;     // The parent course ID
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Subject created successfully",
    "data": {
      "id": "uuid-string",
      "code": "BCA-101",
      "name": "Mathematics-I",
      "credits": 3,
      "semester": 1,
      "academicYear": "2026-2027",
      "courseId": "course-uuid-string"
    }
  }
  ```

### 2. List Subjects
* **Route**: `GET /api/subjects`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Query Parameters** (Optional):
  - `courseId`: Filter by course
  - `semester`: Filter by semester
  - `academicYear`: Filter by academic year
  - `institute`: Filter by institute (Admins/Faculty/Students are locked to their own institute)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Subjects retrieved successfully",
    "data": [
      {
        "id": "uuid",
        "code": "BCA-101",
        "name": "Mathematics-I",
        "credits": 3,
        "semester": 1,
        "academicYear": "2026-2027",
        "course": {
          "id": "course-uuid",
          "name": "BCA",
          "institute": "RMIT"
        }
      }
    ]
  }
  ```

### 3. Get Subject by ID
* **Route**: `GET /api/subjects/:id`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Subject details retrieved successfully",
    "data": {
      "id": "uuid",
      "code": "BCA-101",
      "name": "Mathematics-I",
      "credits": 3,
      "semester": 1,
      "academicYear": "2026-2027"
    }
  }
  ```

### 4. Update Subject
* **Route**: `PATCH /api/subjects/:id`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` and `ADMIN` authorized)
* **Request Body**:
  ```ts
  {
    code?: string;
    name?: string;
    credits?: number;
    semester?: number;
    academicYear?: string;
    courseId?: string;
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Subject updated successfully",
    "data": {
      "id": "uuid",
      "code": "BCA-101",
      "name": "Updated Mathematics-I",
      "credits": 4,
      "semester": 1,
      "academicYear": "2026-2027"
    }
  }
  ```

### 5. Delete Subject
* **Route**: `DELETE /api/subjects/:id`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` and `ADMIN` authorized)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Subject deleted successfully"
  }
  ```

---

## Grading & Exam Endpoints (`/api/grades`)

Provides endpoints to record marks, calculate results, and generate report cards.

### 1. Record / Upsert Marks
* **Route**: `POST /api/grades`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN`, `ADMIN`, and `FACULTY` authorized)
* **Request Body**:
  ```ts
  {
    studentId: string;      // The target student profile ID
    subjectId: string;      // The target subject ID
    internalMarks?: number; // Out of 30 (Theory Internals, attendance, etc.)
    externalMarks?: number; // Out of 70 (Theory Externals, end semester exam)
    practicalMarks?: number;// Out of 30 (Practical lab exam, optional)
  }
  ```
* **Calculations**:
  - `totalMarks` = internal + external + practical (Max is 130 if practical is present, 100 if absent)
  - `gradeLetter` & `gp` (Grade Point) calculated dynamically based on percentage ($\ge 90\% = O (10.0)$, $\ge 80\% = A+ (9.0)$, etc.)
  - `passed` set to `false` if final grade letter is `"F"`.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Grade recorded successfully",
    "data": {
      "id": "grade-uuid",
      "studentId": "student-uuid",
      "subjectId": "subject-uuid",
      "internalMarks": 25,
      "externalMarks": 62,
      "practicalMarks": null,
      "totalMarks": 87,
      "gradeLetter": "A+",
      "gp": 9,
      "passed": true
    }
  }
  ```

### 2. Get Student Grades
* **Route**: `GET /api/grades/student/:studentId`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Access Boundary**:
  - `STUDENT` role can only view their own grades.
  - `ADMIN` & `FACULTY` roles can view grades of any student inside their institute.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Grades retrieved successfully",
    "data": [
      {
        "id": "grade-uuid",
        "totalMarks": 87,
        "gradeLetter": "A+",
        "gp": 9,
        "passed": true,
        "subject": {
          "code": "BCA-101",
          "name": "Mathematics-I",
          "semester": 1,
          "credits": 3
        }
      }
    ]
  }
  ```

### 3. Get Student Report Card
* **Route**: `GET /api/grades/report-card`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `STUDENT` authorized)
* **Computations**:
  - Groups subjects by semester.
  - Dynamically calculates the **SGPA** for each semester:
    $$\text{SGPA} = \frac{\sum (\text{GP} \times \text{Credits})}{\sum \text{Credits}}$$
  - Dynamically calculates the cumulative **CGPA** across all semesters.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Report card generated successfully",
    "data": {
      "student": {
        "id": "student-uuid",
        "name": "John Doe",
        "rollNumber": "RMIT2026001",
        "institute": "RMIT"
      },
      "reportCard": {
        "1": {
          "semester": 1,
          "sgpa": 9.33,
          "totalCredits": 9,
          "grades": [
            {
              "subjectCode": "BCA-101",
              "subjectName": "Mathematics-I",
              "credits": 3,
              "totalMarks": 87,
              "gradeLetter": "A+",
              "gp": 9,
              "passed": true
            }
          ]
        }
      },
      "cgpa": 9.33
    }
  }
  ```

---

## Hostel Management Endpoints (`/api/hostels`)

Hostels accommodate student residential facilities. Creation and modification are restricted to `SUPER_ADMIN`, while admissions are delegated to `SUPER_ADMIN` and `ADMIN` roles.

### 1. Create Hostel
* **Route**: `POST /api/hostels`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` authorized)
* **Request Body**:
  ```ts
  {
    name: string;        // Unique hostel name (e.g. "Ramanujan Boys Hostel")
    type: "BOYS" | "GIRLS" | "COED";
    capacity?: number;   // Max occupant capacity (defaults to 100)
    institute: Institute;// e.g. "RMIT"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Hostel created successfully",
    "data": {
      "id": "hostel-uuid",
      "name": "Ramanujan Boys Hostel",
      "type": "BOYS",
      "capacity": 100,
      "institute": "RMIT",
      "createdAt": "2026-07-23T00:00:00.000Z",
      "updatedAt": "2026-07-23T00:00:00.000Z"
    }
  }
  ```

### 2. List Hostels
* **Route**: `GET /api/hostels`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Query Parameters** (Optional):
  - `type`: Filter by hostel type (`BOYS`, `GIRLS`, `COED`)
  - `institute`: Filter by institute (Admins/Faculty/Students are locked to their own institute)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Hostels retrieved successfully",
    "data": [
      {
        "id": "hostel-uuid",
        "name": "Ramanujan Boys Hostel",
        "type": "BOYS",
        "capacity": 100,
        "institute": "RMIT",
        "_count": {
          "studentProfiles": 25
        }
      }
    ]
  }
  ```

### 3. Get Hostel by ID
* **Route**: `GET /api/hostels/:id`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Hostel details retrieved successfully",
    "data": {
      "id": "hostel-uuid",
      "name": "Ramanujan Boys Hostel",
      "type": "BOYS",
      "capacity": 100,
      "institute": "RMIT",
      "studentProfiles": [
        {
          "id": "student-profile-uuid",
          "name": "John Doe Student",
          "roomNumber": "104-A",
          "gender": "MALE"
        }
      ]
    }
  }
  ```

### 4. Admit Student to Hostel
* **Route**: `POST /api/hostels/admit`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` and `ADMIN` authorized)
* **Request Body**:
  ```ts
  {
    studentId: string;   // The target student profile ID
    hostelId: string;    // The target hostel ID
    roomNumber?: string; // Room allocation number (optional)
  }
  ```
* **Operations**:
  - Verifies that the hostel's occupant count is less than `capacity`.
  - Verifies student gender matches hostel type rules (e.g. `BOYS` hostel requires `MALE` student).
  - Admin Boundary: Admins can only admit students and hostels belonging to their own institute.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Student admitted to hostel successfully",
    "data": {
      "id": "student-profile-uuid",
      "name": "John Doe Student",
      "hostelId": "hostel-uuid",
      "roomNumber": "104-A"
    }
  }
  ```

### 5. Vacate Student from Hostel
* **Route**: `POST /api/hostels/vacate`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` and `ADMIN` authorized)
* **Request Body**:
  ```ts
  {
    studentId: string;   // The target student profile ID to vacate
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Student vacated from hostel successfully"
  }
  ```

### 6. Update Hostel
* **Route**: `PATCH /api/hostels/:id`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` authorized)
* **Request Body**:
  ```ts
  {
    name?: string;
    type?: "BOYS" | "GIRLS" | "COED";
    capacity?: number;
    institute?: Institute;
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Hostel updated successfully",
    "data": {
      "id": "hostel-uuid",
      "name": "Ramanujan Boys Hostel (Updated)",
      "type": "BOYS",
      "capacity": 120,
      "institute": "RMIT"
    }
  }
  ```

### 7. Delete Hostel
* **Route**: `DELETE /api/hostels/:id`
* **Headers**: `Authorization: Bearer <TOKEN>` (Only `SUPER_ADMIN` authorized)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Hostel deleted successfully"
  }
  ```
