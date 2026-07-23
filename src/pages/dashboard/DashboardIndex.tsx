import AdminDashboard from "./AdminDashboard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Index = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return user ? <AdminDashboard /> : <Navigate to="/adminlogin" />;
};

export default Index;
