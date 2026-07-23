import AdminDashboard from "./AdminDashboard";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Index = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user ? <AdminDashboard /> : <Navigate to="/adminlogin" />;
};

export default Index;
