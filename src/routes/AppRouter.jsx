import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TempRegisterProfe from "../components/TempRegisterProfe";
import RegisterStudent from "../components/RegisterStudent";
import EstudiantesPage from "../pages/EstudiantesPage";
import MateriasPage from "../pages/MateriasPage";
import NotasPorMateria from "../components/NotasPorMateria";
import LandingPage from "../pages/LandingPage";

function PrivateRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role))
    return (
      <div className="text-center mt-10 text-yellow-600">
        No tienes rol asignado en Firestore
      </div>
    );
  return children;
}

export default function AppRouter() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-profe" element={<TempRegisterProfe />} />
        <Route path="/register-student" element={<RegisterStudent />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute allowedRoles={["profesor", "estudiante"]}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/estudiantes"
          element={
            <PrivateRoute allowedRoles={["profesor"]}>
              <EstudiantesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/materias"
          element={
            <PrivateRoute allowedRoles={["profesor"]}>
              <MateriasPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notas-por-materia"
          element={
            <PrivateRoute allowedRoles={["profesor"]}>
              <NotasPorMateria />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
