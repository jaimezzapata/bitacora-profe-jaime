import { getAuth, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { getCollection } from "../services/firestoreService";
import ProfesorDashboard from "../components/ProfesorDashboard";
import NotasPorMateria from "../components/NotasPorMateria";
import EstudiantesPage from "../pages/EstudiantesPage";
import MateriasPage from "../pages/MateriasPage";
import AsideMenu from "../components/AsideMenu";
import Banner from "../components/Banner";

export default function DashboardPage({ customContent }) {
  const { user, role, logout, loading } = useAuth();
  const nombre = user?.displayName || user?.name || user?.nombre || user?.email;

  const [stats, setStats] = useState({
    estudiantes: 0,
    materias: [],
    notas: [],
  });
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado del menú móvil
  const location = useLocation();

  useEffect(() => {
    async function fetchStats() {
      if (role === "profesor") {
        const estudiantes = await getCollection("users", [
          { field: "role", op: "==", value: "estudiante" },
        ]);
        const notas = await getCollection("notas");
        const materias = await getCollection("materias"); // <-- ahora trae todas las materias reales
        setStats({
          estudiantes: estudiantes.length,
          materias, // <-- ahora es el array real de materias
          notas,
        });
      }
    }
    fetchStats();
  }, [role]);

  useEffect(() => {
    if (
      user &&
      role === "estudiante" &&
      !user.displayName &&
      (user.name || user.nombre)
    ) {
      const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName: user.name || user.nombre,
      });
    }
  }, [user, role]);

  if (loading)
    return (
      <div className="text-center mt-10 text-blue-600">
        Cargando datos de usuario...
      </div>
    );
  if (!user)
    return <div className="text-center mt-10 text-red-600">No autenticado</div>;
  if (!role)
    return (
      <div className="text-center mt-10 text-yellow-600">
        No tienes rol asignado en Firestore
      </div>
    );

  // Overlay global para móvil
  const overlay = menuAbierto ? (
    <div
      className="fixed inset-0 bg-black/50 z-30 md:hidden"
      onClick={() => setMenuAbierto(false)}
    ></div>
  ) : null;

  // Mostrar dashboard según el rol y ruta
  if (role === "profesor" && location.pathname === "/estudiantes") {
    return (
      <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative">
        {/* Botón hamburguesa solo visible en móvil */}
        <button
          onClick={() => setMenuAbierto(true)}
          className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        >
          ☰
        </button>
        {overlay}
        <AsideMenu
          role={role}
          setMenuAbierto={setMenuAbierto}
          logout={logout}
          menuAbierto={menuAbierto}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Banner
            nombre={nombre}
            email={user?.email}
            role={role}
            logout={logout}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
            <EstudiantesPage
              menuAbierto={menuAbierto}
              setMenuAbierto={setMenuAbierto}
            />
          </main>
        </div>
      </div>
    );
  }

  if (role === "profesor" && location.pathname === "/materias") {
    return (
      <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative">
        {/* Botón hamburguesa solo visible en móvil */}
        <button
          onClick={() => setMenuAbierto(true)}
          className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        >
          ☰
        </button>
        {overlay}
        <AsideMenu
          role={role}
          setMenuAbierto={setMenuAbierto}
          logout={logout}
          menuAbierto={menuAbierto}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Banner
            nombre={nombre}
            email={user?.email}
            role={role}
            logout={logout}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
            <MateriasPage
              menuAbierto={menuAbierto}
              setMenuAbierto={setMenuAbierto}
            />
          </main>
        </div>
      </div>
    );
  }

  return role === "profesor" ? (
    <ProfesorDashboard
      stats={stats}
      user={user}
      role={role}
      logout={logout}
      menuAbierto={menuAbierto}
      setMenuAbierto={setMenuAbierto}
    />
  ) : role === "estudiante" ? (
    <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative">
      {/* Botón hamburguesa solo visible en móvil */}
      <button
        onClick={() => setMenuAbierto(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>
      {/* Overlay menú móvil */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMenuAbierto(false)}
        ></div>
      )}
      <AsideMenu
        role={role}
        setMenuAbierto={setMenuAbierto}
        logout={logout}
        menuAbierto={menuAbierto}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Banner
          nombre={nombre}
          email={user?.email}
          role={role}
          logout={logout}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
          <div className="w-full bg-white/90 rounded-2xl shadow-xl p-3 sm:p-6 md:p-8 text-center">
            <p className="text-blue-700 font-semibold">Panel de estudiante</p>
            <p className="text-gray-600 text-sm md:text-base mb-4">
              Solo puedes consultar tus propias notas.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 shadow flex flex-col items-center">
              <span className="text-blue-600 font-semibold mb-2">
                Materias inscritas
              </span>
              <ul className="text-blue-800 text-sm">
                {user?.subject ? (
                  <li>{user.subject}</li>
                ) : (
                  <li className="text-gray-400">
                    No tienes materias inscritas.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  ) : null;
}
