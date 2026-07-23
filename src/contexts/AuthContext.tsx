import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { DatabaseUser } from "@app/types/users";
import { apiClient } from "@services/apiClient";

export interface UserSession {
  token: string;
  user: DatabaseUser;
}

interface AuthContextType {
  session: UserSession | null;
  user: DatabaseUser | null;
  isLoading: boolean;
  databaseUser: DatabaseUser | null;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  databaseUser: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [user, setUser] = useState<DatabaseUser | null>(null);
  const [databaseUser, setDatabaseUser] = useState<DatabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        if (apiClient.isDemoMode()) {
          const storedSessionStr = localStorage.getItem("rmit_auth_session");
          if (storedSessionStr) {
            const storedSession = JSON.parse(storedSessionStr) as UserSession;
            setSession(storedSession);
            setUser(storedSession.user);
            setDatabaseUser(storedSession.user);
          }
        } else {
          // If a custom backend is configured, retrieve the user profile
          const token = localStorage.getItem("rmit_auth_token");
          if (token) {
            const me = await apiClient.get<DatabaseUser>("/users/me");
            const activeSession = { token, user: me };
            setSession(activeSession);
            setUser(me);
            setDatabaseUser(me);
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        // Clear token on authorization failure
        localStorage.removeItem("rmit_auth_token");
        localStorage.removeItem("rmit_auth_session");
        localStorage.removeItem("rmit_auth_user");
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen to authentication changes
    const {
      data: { subscription },
    } = apiClient.onAuthStateChange((event, newSession) => {
      if (event === "SIGNED_OUT" || !newSession) {
        setSession(null);
        setUser(null);
        setDatabaseUser(null);
      } else {
        setSession(newSession);
        setUser(newSession.user);
        setDatabaseUser(newSession.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    session,
    user,
    isLoading,
    databaseUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
