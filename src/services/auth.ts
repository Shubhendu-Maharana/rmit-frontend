import { apiClient } from "@services/apiClient";
import { DatabaseUser } from "@app/types/users";

export interface AuthResponse {
  user: DatabaseUser;
  token: string;
}

export const signIn = async (
  email: string,
  password: string,
  role: "admin" | "faculty",
): Promise<AuthResponse> => {
  const data = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
    role,
  });
  return data;
};

export const signOut = async (): Promise<void> => {
  await apiClient.post<void>("/auth/logout", {});
};
