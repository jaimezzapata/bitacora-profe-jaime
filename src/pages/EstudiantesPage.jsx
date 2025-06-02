import EstudiantesList from "../components/EstudiantesList";
import { useAuth } from "../context/AuthContext";

export default function EstudiantesPage({ menuAbierto, setMenuAbierto }) {
  const { role, logout } = useAuth();
  return (
    <EstudiantesList
      menuAbierto={menuAbierto}
      setMenuAbierto={setMenuAbierto}
      role={role}
      logout={logout}
    />
  );
}
