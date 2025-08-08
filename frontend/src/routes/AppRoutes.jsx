import { useRoutes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardLayout from "../layouts/AdminLayout";
import TeacherDashboardLayout from "../layouts/TeacherDashboardLayout";
import StudentDashboardLayout from "../layouts/StudentDashboardLayout";
// Auth Pages
import Login from "../pages/Login";
// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import RegisterUser from "../pages/admin/RegisterUser";
import TeachersList from "../pages/admin/TeacherList";
import StudentsList from "../pages/admin/StudentList";
import EditTeacher from "../pages/admin/EditTeacher";
import EditStudent from "../pages/admin/EditStudent";


// Teacher Pages
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import RegisterStudent from "../pages/teacher/RegisterStudentByTeacher";
import TeacherStudentList from "../pages/teacher/TeacherStudentList";
import EditStudentByTeacher from "../pages/teacher/EditStudentByTeacher";
import TeacherProfile from "../pages/teacher/TeacherProfile";

// Student Pages
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";

import { useAuth } from "../context/AuthContext";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { path: "/", element: <Login /> },
        { path: "/login", element: <Login /> },
      ],
    },
    {
      path: "/admin",
      element: <ProtectedLayout />,
      children: [
        {
          path: "dashboard",
          element: <DashboardLayout />,
          children: [
            { path: "", element: <AdminDashboard /> },
            { path: "teachers", element: <TeachersList /> },
            { path: "students", element: <StudentsList /> },
            { path: "teachers/edit-teacher/:id", element: <EditTeacher /> },
            { path: "students/edit-student/:id", element: <EditStudent /> },
            { path: "register", element: <RegisterUser /> },
          ],
        },
      ],
    },
    {
      path: "/teacher",
      element: <ProtectedLayout />,
      children: [
        {
          path: "dashboard",
          element: <TeacherDashboardLayout />,
          children: [
            { path: "", element: <TeacherDashboard /> },
            { path: "register-student", element: <RegisterStudent /> },
            { path: "students", element: <TeacherStudentList /> },
            { path: "students/:id/edit", element: <EditStudentByTeacher /> },
            { path: "profile", element: <TeacherProfile /> },


          ],
        },
      ],
    },
    {
      path: "/student",
      element: <ProtectedLayout />,
      children: [
        {
          path: "dashboard",
          element: <StudentDashboardLayout />,
          children: [
            { index: true, element: <StudentDashboard /> },
            { path: "dashboard", element: <StudentDashboard /> },
            { path: "profile", element: <StudentProfile /> },
          ],
        },
      ],
    },
  ]);

  return routes;
};

export default AppRoutes;
