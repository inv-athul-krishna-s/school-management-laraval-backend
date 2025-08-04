import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TeacherList from "../pages/admin/TeacherList";
import StudentList from "../pages/admin/StudentList";
import RegisterUser from "../pages/admin/RegisterUser";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="teachers" element={<TeacherList />} />
        <Route path="students" element={<StudentList />} />
        <Route path="register" element={<RegisterUser />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
