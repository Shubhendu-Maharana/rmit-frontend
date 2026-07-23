import { Faculty, Student, Notice, Timetable } from "@app/types/dataTypes";
import { DatabaseUser } from "@app/types/users";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Seed Data for Demo Fallback
const DEFAULT_USERS: DatabaseUser[] = [
  { id: "u1", name: "Administrator", email: "admin@college.edu", role: "admin" },
  { id: "u2", name: "Dr. Ramesh Kumar", email: "faculty@college.edu", role: "faculty" }
];

const DEFAULT_FACULTIES: Faculty[] = [
  {
    id: "f1",
    name: "Dr. Ramesh Kumar",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    department: "Degree",
    specialization: "Artificial Intelligence & Robotics",
    email: "ramesh.kumar@college.edu",
    phone: "+91 98765 43210",
    education: "Ph.D. in Computer Science (IIT Bombay)",
    is_hod: true,
    joining_date: "2018-06-15"
  },
  {
    id: "f2",
    name: "Prof. Sarah D'Souza",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    department: "Degree",
    specialization: "Advanced Machine Learning",
    email: "sarah.dsouza@college.edu",
    phone: "+91 98765 43211",
    education: "M.Tech in CS (BITS Pilani)",
    is_hod: false,
    joining_date: "2020-01-10"
  },
  {
    id: "f3",
    name: "Mr. Amit Patel",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    department: "Diploma",
    specialization: "Embedded Systems",
    email: "amit.patel@college.edu",
    phone: "+91 98765 43212",
    education: "M.E. in Electronics (COEP)",
    is_hod: true,
    joining_date: "2015-07-20"
  },
  {
    id: "f4",
    name: "Mrs. Priya Sharma",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    department: "ITI",
    specialization: "Electrical Craftsmanship",
    email: "priya.sharma@college.edu",
    phone: "+91 98765 43213",
    education: "B.Tech in Electrical Engineering",
    is_hod: false,
    joining_date: "2021-08-01"
  }
];

const DEFAULT_STUDENTS: Student[] = [
  {
    id: "s1",
    roll_number: "CS2023001",
    name: "Rahul Verma",
    email: "rahul.verma@student.edu",
    phone: 9876543220,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    department: "Computer Science",
    semester: 5,
    dob: "2003-04-12",
    gender: "Male",
    address: "123, Park Street, Mumbai, Maharashtra",
    guardian_name: "Sanjay Verma",
    guardian_phone: 9876543221,
    admission_date: "2023-07-15"
  },
  {
    id: "s2",
    roll_number: "EE2023014",
    name: "Ananya Sen",
    email: "ananya.sen@student.edu",
    phone: 9876543230,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    department: "Engineering",
    semester: 3,
    dob: "2004-11-23",
    gender: "Female",
    address: "45, Green Avenue, Kolkata, West Bengal",
    guardian_name: "Dilip Sen",
    guardian_phone: 9876543231,
    admission_date: "2023-07-20"
  }
];

const DEFAULT_NOTICES: Notice[] = [
  {
    id: "n1",
    title: "End Semester Examinations Schedule - November 2026",
    date: "2026-07-20",
    category: "exams",
    file_path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    important: true
  },
  {
    id: "n2",
    title: "Annual Tech Fest 'RMIT-TECH 2026' Registrations Open",
    date: "2026-07-18",
    category: "events",
    file_path: "",
    important: false
  },
  {
    id: "n3",
    title: "Revised Academic Calendar for Odd Semesters",
    date: "2026-07-15",
    category: "academic",
    file_path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    important: true
  }
];

const DEFAULT_TIMETABLES: Timetable[] = [
  {
    id: "t1",
    program: "Computer Science & Engineering",
    program_type: "Degree",
    semester: "5",
    academic_year: "2026-27",
    last_updated: "2026-07-22",
    file_link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "t2",
    program: "Mechanical Engineering",
    program_type: "Diploma",
    semester: "3",
    academic_year: "2026-27",
    last_updated: "2026-07-21",
    file_link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

const initLocalStorage = () => {
  if (!localStorage.getItem("rmit_users")) {
    localStorage.setItem("rmit_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("rmit_faculties")) {
    localStorage.setItem("rmit_faculties", JSON.stringify(DEFAULT_FACULTIES));
  }
  if (!localStorage.getItem("rmit_students")) {
    localStorage.setItem("rmit_students", JSON.stringify(DEFAULT_STUDENTS));
  }
  if (!localStorage.getItem("rmit_notices")) {
    localStorage.setItem("rmit_notices", JSON.stringify(DEFAULT_NOTICES));
  }
  if (!localStorage.getItem("rmit_timetables")) {
    localStorage.setItem("rmit_timetables", JSON.stringify(DEFAULT_TIMETABLES));
  }
};

if (typeof window !== "undefined") {
  initLocalStorage();
}

type AuthListener = (event: string, session: { token: string; user: DatabaseUser } | null) => void;
const authListeners = new Set<AuthListener>();

export const apiClient = {
  isDemoMode: () => !API_URL,

  get: async <T>(endpoint: string): Promise<T> => {
    if (apiClient.isDemoMode()) {
      return apiClient.mockGet<T>(endpoint);
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("rmit_auth_token")}`
      }
    });
    if (!res.ok) throw new Error(await res.text() || "Request failed");
    return res.json();
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
    if (apiClient.isDemoMode()) {
      return apiClient.mockPost<T>(endpoint, body);
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("rmit_auth_token")}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text() || "Request failed");
    return res.json();
  },

  put: async <T>(endpoint: string, body: any): Promise<T> => {
    if (apiClient.isDemoMode()) {
      return apiClient.mockPut<T>(endpoint, body);
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("rmit_auth_token")}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text() || "Request failed");
    return res.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    if (apiClient.isDemoMode()) {
      return apiClient.mockDelete<T>(endpoint);
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("rmit_auth_token")}`
      }
    });
    if (!res.ok) throw new Error(await res.text() || "Request failed");
    return res.json();
  },

  // Mock implementation for localStorage
  mockGet: <T>(endpoint: string): T => {
    const route = endpoint.split("?")[0];
    if (route === "/auth/session") {
      const session = localStorage.getItem("rmit_auth_session");
      return (session ? JSON.parse(session) : null) as T;
    }
    if (route === "/users/me") {
      const user = localStorage.getItem("rmit_auth_user");
      return (user ? JSON.parse(user) : null) as T;
    }
    if (route === "/faculties") {
      return JSON.parse(localStorage.getItem("rmit_faculties") || "[]") as T;
    }
    if (route === "/students") {
      return JSON.parse(localStorage.getItem("rmit_students") || "[]") as T;
    }
    if (route === "/notices") {
      return JSON.parse(localStorage.getItem("rmit_notices") || "[]") as T;
    }
    if (route === "/timetables") {
      return JSON.parse(localStorage.getItem("rmit_timetables") || "[]") as T;
    }
    throw new Error(`Endpoint not found in mock mode: ${endpoint}`);
  },

  mockPost: <T>(endpoint: string, body: any): T => {
    if (endpoint === "/auth/login") {
      const { email, password, role } = body;
      const users: DatabaseUser[] = JSON.parse(localStorage.getItem("rmit_users") || "[]");
      const matched = users.find(u => u.email === email && u.role === role);
      if (!matched && email === "admin@college.edu" && password === "password") {
        const adminUser: DatabaseUser = { id: "u1", name: "Administrator", email, role: "admin" };
        const session = { token: "mock_jwt_token", user: adminUser };
        localStorage.setItem("rmit_auth_token", "mock_jwt_token");
        localStorage.setItem("rmit_auth_user", JSON.stringify(adminUser));
        localStorage.setItem("rmit_auth_session", JSON.stringify(session));
        apiClient.triggerAuthChange("SIGNED_IN", session);
        return session as unknown as T;
      }
      if (matched && password === "password") {
        const session = { token: "mock_jwt_token", user: matched };
        localStorage.setItem("rmit_auth_token", "mock_jwt_token");
        localStorage.setItem("rmit_auth_user", JSON.stringify(matched));
        localStorage.setItem("rmit_auth_session", JSON.stringify(session));
        apiClient.triggerAuthChange("SIGNED_IN", session);
        return session as unknown as T;
      }
      throw new Error("Invalid credentials or unauthorized role");
    }

    if (endpoint === "/auth/logout") {
      localStorage.removeItem("rmit_auth_token");
      localStorage.removeItem("rmit_auth_user");
      localStorage.removeItem("rmit_auth_session");
      apiClient.triggerAuthChange("SIGNED_OUT", null);
      return { success: true } as T;
    }

    const id = "mock_" + Math.random().toString(36).substr(2, 9);
    const item = { ...body, id };

    if (endpoint === "/faculties") {
      const items = JSON.parse(localStorage.getItem("rmit_faculties") || "[]");
      items.push(item);
      localStorage.setItem("rmit_faculties", JSON.stringify(items));
      return item as T;
    }
    if (endpoint === "/students") {
      const items = JSON.parse(localStorage.getItem("rmit_students") || "[]");
      items.push(item);
      localStorage.setItem("rmit_students", JSON.stringify(items));
      return item as T;
    }
    if (endpoint === "/notices") {
      const items = JSON.parse(localStorage.getItem("rmit_notices") || "[]");
      items.push(item);
      localStorage.setItem("rmit_notices", JSON.stringify(items));
      return item as T;
    }
    if (endpoint === "/timetables") {
      const items = JSON.parse(localStorage.getItem("rmit_timetables") || "[]");
      items.push(item);
      localStorage.setItem("rmit_timetables", JSON.stringify(items));
      return item as T;
    }

    throw new Error(`Endpoint not found in mock mode: ${endpoint}`);
  },

  mockPut: <T>(endpoint: string, body: any): T => {
    const parts = endpoint.split("/");
    const id = parts[parts.length - 1];
    const route = "/" + parts.slice(1, -1).join("/");

    if (route === "/faculties") {
      let items: Faculty[] = JSON.parse(localStorage.getItem("rmit_faculties") || "[]");
      items = items.map(x => x.id === id ? { ...body, id } : x);
      localStorage.setItem("rmit_faculties", JSON.stringify(items));
      return body as T;
    }
    if (route === "/students") {
      let items: Student[] = JSON.parse(localStorage.getItem("rmit_students") || "[]");
      items = items.map(x => x.id === id ? { ...body, id } : x);
      localStorage.setItem("rmit_students", JSON.stringify(items));
      return body as T;
    }
    if (route === "/notices") {
      let items: Notice[] = JSON.parse(localStorage.getItem("rmit_notices") || "[]");
      items = items.map(x => x.id === id ? { ...body, id } : x);
      localStorage.setItem("rmit_notices", JSON.stringify(items));
      return body as T;
    }
    if (route === "/timetables") {
      let items: Timetable[] = JSON.parse(localStorage.getItem("rmit_timetables") || "[]");
      items = items.map(x => x.id === id ? { ...body, id } : x);
      localStorage.setItem("rmit_timetables", JSON.stringify(items));
      return body as T;
    }

    throw new Error(`Endpoint not found in mock mode: ${endpoint}`);
  },

  mockDelete: <T>(endpoint: string): T => {
    const parts = endpoint.split("/");
    const id = parts[parts.length - 1];
    const route = "/" + parts.slice(1, -1).join("/");

    if (route === "/faculties") {
      let items: Faculty[] = JSON.parse(localStorage.getItem("rmit_faculties") || "[]");
      items = items.filter(x => x.id !== id);
      localStorage.setItem("rmit_faculties", JSON.stringify(items));
      return { success: true } as unknown as T;
    }
    if (route === "/students") {
      let items: Student[] = JSON.parse(localStorage.getItem("rmit_students") || "[]");
      items = items.filter(x => x.id !== id);
      localStorage.setItem("rmit_students", JSON.stringify(items));
      return { success: true } as unknown as T;
    }
    if (route === "/notices") {
      let items: Notice[] = JSON.parse(localStorage.getItem("rmit_notices") || "[]");
      items = items.filter(x => x.id !== id);
      localStorage.setItem("rmit_notices", JSON.stringify(items));
      return { success: true } as unknown as T;
    }
    if (route === "/timetables") {
      let items: Timetable[] = JSON.parse(localStorage.getItem("rmit_timetables") || "[]");
      items = items.filter(x => x.id !== id);
      localStorage.setItem("rmit_timetables", JSON.stringify(items));
      return { success: true } as unknown as T;
    }

    throw new Error(`Endpoint not found in mock mode: ${endpoint}`);
  },

  onAuthStateChange: (callback: AuthListener) => {
    authListeners.add(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners.delete(callback);
          }
        }
      }
    };
  },

  triggerAuthChange: (event: string, session: { token: string; user: DatabaseUser } | null) => {
    authListeners.forEach(listener => listener(event, session));
  }
};
