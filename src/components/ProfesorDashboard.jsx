import React from "react";
import Banner from "./Banner";
import AsideMenu from "./AsideMenu";

export default function ProfesorDashboard({
  stats,
  user,
  role,
  logout,
  menuAbierto,
  setMenuAbierto,
}) {
  const nombre = user?.displayName || user?.name || user?.nombre || user?.email;
  return (
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-100 rounded-xl p-4 shadow flex flex-col items-center">
                  <span className="text-3xl font-bold text-blue-700">
                    {stats.estudiantes}
                  </span>
                  <span className="text-blue-600 mt-1">Estudiantes</span>
                </div>
                <div className="bg-green-100 rounded-xl p-4 shadow flex flex-col items-center">
                  <span className="text-3xl font-bold text-green-700">
                    {Array.isArray(stats.materias) ? stats.materias.length : 0}
                  </span>
                  <span className="text-green-600 mt-1">Materias</span>
                </div>
                <div className="bg-yellow-100 rounded-xl p-4 shadow flex flex-col items-center">
                  <span className="text-3xl font-bold text-yellow-700">
                    {stats.notas.length}
                  </span>
                  <span className="text-yellow-600 mt-1">Notas</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  Notas por materia
                </h3>
                <div className="flex flex-wrap gap-6 mt-10">
                  {Object.entries(
                    stats.notas.reduce((acc, nota) => {
                      const key = nota.asignatura || "Sin asignatura";
                      acc[key] = (acc[key] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([materia, total], idx) => {
                    const postitColors = [
                      "bg-yellow-100 border-yellow-300 text-yellow-900",
                      "bg-pink-100 border-pink-300 text-pink-900",
                      "bg-blue-100 border-blue-300 text-blue-900",
                      "bg-green-100 border-green-300 text-green-900",
                      "bg-purple-100 border-purple-300 text-purple-900",
                    ];
                    const color = postitColors[idx % postitColors.length];
                    return (
                      <div
                        key={materia}
                        className={`rounded-2xl shadow-xl w-60 h-60 flex flex-col justify-center items-center relative border-2 ${color} transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                        style={{ boxShadow: "0 8px 32px #0002" }}
                      >
                        <span className="absolute top-4 left-4 text-2xl select-none">
                          📎
                        </span>
                        <div className="font-bold text-xl truncate mb-2 text-center w-48">
                          {materia}
                        </div>
                        <div className="text-6xl font-extrabold mb-2">
                          {total}
                        </div>
                        <div className="text-base font-semibold opacity-80">
                          notas registradas
                        </div>
                        <span className="absolute right-4 bottom-4 text-2xl opacity-60 select-none">
                          ★
                        </span>
                      </div>
                    );
                  })}
                  {stats.notas.length === 0 && (
                    <div className="text-gray-400">
                      No hay notas registradas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
