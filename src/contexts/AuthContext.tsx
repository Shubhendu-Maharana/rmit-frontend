import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { DatabaseUser } from "@app/types/users";
import { onAuthStateChange, UserSession } from "@services/auth";

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
        const storedSessionStr = localStorage.getItem("rmit_auth_session");
        if (storedSessionStr) {
          const storedSession = JSON.parse(storedSessionStr) as UserSession;
          setSession(storedSession);
          setUser(storedSession.user);
          setDatabaseUser(storedSession.user);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen to authentication changes from local auth service
    const unsubscribe = onAuthStateChange((newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setDatabaseUser(newSession?.user ?? null);
    });

    return () => {
      unsubscribe();
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
