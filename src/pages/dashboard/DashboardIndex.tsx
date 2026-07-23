import { useAuth } from "../../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Navigate } from "react-router";

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return user ? <AdminDashboard /> : <Navigate to="/adminlogin" />;
};

export default Index;
