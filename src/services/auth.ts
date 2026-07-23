import { DatabaseUser } from "@app/types/users";

export interface UserSession {
  token: string;
  user: DatabaseUser;
}

type AuthListener = (session: UserSession | null) => void;
const listeners = new Set<AuthListener>();

export const onAuthStateChange = (callback: AuthListener) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

export const triggerAuthChange = (session: UserSession | null) => {
  listeners.forEach((cb) => cb(session));
};

export const signIn = async (
  email: string,
  _password: string,
  role: "admin" | "faculty",
): Promise<UserSession> => {
  const session: UserSession = {
    token: "stub_jwt_token",
    user: {
      id: "stub_admin",
      name: "Administrator",
      email,
      role,
    },
  };
  localStorage.setItem("rmit_auth_session", JSON.stringify(session));
  triggerAuthChange(session);
  return session;
};

export const signOut = async (): Promise<void> => {
  localStorage.removeItem("rmit_auth_session");
  triggerAuthChange(null);
};
