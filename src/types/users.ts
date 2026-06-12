export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "faculty";
}
