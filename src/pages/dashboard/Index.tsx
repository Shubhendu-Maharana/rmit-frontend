import { useAuth } from "../../contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UserNotFoundPage from "../../components/UserNotFoundPage";
import LoadingSpinner from "../../components/LoadingSpinner";

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return user ? <AdminDashboard /> : <UserNotFoundPage />;
};

export default Index;
