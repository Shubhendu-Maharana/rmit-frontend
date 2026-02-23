import { Route, Routes } from "react-router";
import Home from "./pages/home/Home";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Programs from "./pages/academics/Programs";
import Notices from "./pages/academics/Notices";
import TimeTables from "./pages/academics/TimeTables";
import Faculties from "./pages/administrations/Faculties";
import AdminLogin from "./pages/administrations/AdminLogin";
import StudentLogin from "./pages/student/StudentLogin";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/dashboard/Index";
import NotFoundPage from "./pages/NotFoundPage";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/programs"
          element={
            <PublicLayout>
              <Programs />
            </PublicLayout>
          }
        />
        <Route
          path="/notices"
          element={
            <PublicLayout>
              <Notices />
            </PublicLayout>
          }
        />
        <Route
          path="/timetables"
          element={
            <PublicLayout>
              <TimeTables />
            </PublicLayout>
          }
        />
        <Route
          path="/faculties"
          element={
            <PublicLayout>
              <Faculties />
            </PublicLayout>
          }
        />
        <Route
          path="/adminlogin"
          element={
            <PublicLayout>
              <AdminLogin />
            </PublicLayout>
          }
        />
        <Route
          path="/studentlogin"
          element={
            <PublicLayout>
              <StudentLogin />
            </PublicLayout>
          }
        />
        <Route path="/admin/dashboard" element={<Index />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
