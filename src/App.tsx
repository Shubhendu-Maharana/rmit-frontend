import { Route, Routes } from "react-router";
import Home from "./pages/home/Home";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import Programs from "./pages/academics/Programs";
import AdminLogin from "./pages/admin/AdminLogin";
import StudentLogin from "./pages/student/StudentLogin";
import Index from "./pages/dashboard/DashboardIndex";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastContainer } from "react-toastify";
import AuthGuard from "./components/auth/AuthGuard";

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
    <>
      <ScrollToTop />
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
        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard>
              <Index />
            </AuthGuard>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default App;
