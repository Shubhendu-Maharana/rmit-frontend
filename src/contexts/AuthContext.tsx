import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { DatabaseUser } from "@app/types/users";
import supabase from "@services/supabase";

interface AuthContextType {
  session: Session | null;
  user: User | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [databaseUser, setDatabaseUser] = useState<DatabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setIsLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          getDatabaseUser(session.user.email);
        }

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      getDatabaseUser(session?.user.email);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getDatabaseUser = async (email: string | undefined) => {
    if (!email) return;
    const { data: databaseUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    setDatabaseUser(databaseUser);
  };

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
