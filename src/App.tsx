import { Route, Routes } from "react-router";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Programs from "./pages/academics/Programs";
import Notices from "./pages/academics/Notices";
import TimeTables from "./pages/academics/TimeTables";
import Faculties from "./pages/administrations/Faculties";
import AdminLogin from "./pages/administrations/AdminLogin";
import StudentLogin from "./pages/student/StudentLogin";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/timetable" element={<TimeTables />} />
        <Route path="/faculties" element={<Faculties />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
