import MateriasList from "../components/MateriasList";
import { useAuth } from "../context/AuthContext";

export default function MateriasPage({ menuAbierto, setMenuAbierto }) {
  const { role, logout } = useAuth();
  return (
    <MateriasList
      menuAbierto={menuAbierto}
      setMenuAbierto={setMenuAbierto}
      role={role}
      logout={logout}
    />
  );
}
