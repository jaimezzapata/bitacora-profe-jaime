import React from "react";
import { Link } from "react-router-dom";

export default function AsideMenu({ role, setMenuAbierto, logout, menuAbierto }) {
  // Determinar clases para el aside según tamaño de pantalla y estado
  const asideClass = [
    "h-full w-64 bg-white/90 shadow-xl transition-transform duration-300 ease-in-out rounded-r-2xl p-2 flex flex-col",
    // En móvil: fixed, desplazable, z-40. En desktop: static, visible, z-0
    "fixed top-0 left-0 z-40 md:static md:z-0",
    // En móvil: desplazable según menuAbierto. En desktop: siempre visible
    menuAbierto ? "translate-x-0" : "-translate-x-full",
    "md:translate-x-0"
  ].join(" ");

  return (
    <aside
      className={asideClass}
      style={{ maxWidth: "16rem" }}
    >
      <div className="flex items-center justify-between md:justify-start px-4 py-4 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg font-bold text-blue-700">
            Bitácora Profe Jaime
          </span>
        </div>
        {/* Botón cerrar solo en móvil */}
        <button
          onClick={() => setMenuAbierto(false)}
          className="md:hidden text-blue-700 text-xl focus:outline-none"
          aria-label="Cerrar menú"
        >
          ❌
        </button>
      </div>
      {/* Menú dinámico según rol */}
      <nav className="flex flex-col gap-2 px-4 py-4 flex-1">
        {(role === "profesor" || role === "estudiante") && (
          <>
            <Link
              to="/dasboard"
              className="text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              📄 Home
            </Link>
          </>
        )}
        {role === "profesor" && (
          <>
            <Link
              to="/estudiantes"
              className="text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              👥 Estudiantes
            </Link>
            <Link
              to="/materias"
              className="text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              📚 Materias
            </Link>
            <Link
              to="/notas-por-materia"
              className="text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              🗂️ Notas por materia
            </Link>
          </>
        )}
      </nav>
      <div className="px-4 py-4">
        <button
          onClick={() => {
            setMenuAbierto(false);
            logout();
            window.location.href = "/";
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition-colors"
        >
          🔓 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
