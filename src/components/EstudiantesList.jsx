import { useEffect, useState } from "react";
import {
  getCollection,
  deleteDocument,
  setDocument,
} from "../services/firestoreService";
import AsideMenu from "./AsideMenu";
import Banner from "./Banner";
import { useAuth } from "../context/AuthContext";

// Ahora recibe menuAbierto, setMenuAbierto, role, logout como props
export default function EstudiantesList({
  menuAbierto,
  setMenuAbierto = () => {},
  role,
  logout,
}) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    subject: "",
    password: ""
  });
  const [materias, setMaterias] = useState([]);
  const { user } = useAuth();
  const nombre = user?.displayName || user?.name || user?.nombre || user?.email;
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    fetchEstudiantes();
    getCollection("materias").then(setMaterias);
    // eslint-disable-next-line
  }, []);

  async function fetchEstudiantes() {
    setLoading(true);
    const data = await getCollection("users", [
      { field: "role", op: "==", value: "estudiante" },
    ]);
    setEstudiantes(data);
    setLoading(false);
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este estudiante?")) return;
    await deleteDocument("users", id);
    setActionMsg("Estudiante eliminado");
    fetchEstudiantes();
  };

  const handleEdit = (est) => {
    setEditId(est.id);
    setEditData({
      name: est.name || est.nombre || "",
      email: est.email,
      subject: est.subject || "",
      password: est.password || ""
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    await setDocument("users", editId, { ...editData, role: "estudiante" });
    setEditId(null);
    setActionMsg("Estudiante actualizado");
    fetchEstudiantes();
  };

  const filtered = estudiantes.filter((est) =>
    (est.name || est.nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  // Agrupar estudiantes por materia
  const estudiantesPorMateria = {};
  filtered.forEach((est) => {
    const mat = est.subject || "Sin materia";
    if (!estudiantesPorMateria[mat]) estudiantesPorMateria[mat] = [];
    estudiantesPorMateria[mat].push(est);
  });
  const materiasOrden = Object.keys(estudiantesPorMateria).sort();

  return (
    <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative">
      {/* Botón hamburguesa solo visible en móvil */}
      <button
        onClick={() => setMenuAbierto(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 w-full sm:w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {actionMsg && (
              <span className="text-green-600 font-semibold">{actionMsg}</span>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="flex justify-center items-center h-32 text-gray-500 text-lg">
              No hay estudiantes registrados.
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {materiasOrden.map((materia, idx) => (
                <section key={materia} className="w-full">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4 text-left pl-2">
                    {materia}
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-start">
                    {estudiantesPorMateria[materia].map(est => (
                      <div
                        key={est.id}
                        className="bg-white rounded-lg shadow p-2 w-44 flex flex-col gap-1 border border-blue-100 hover:shadow-xl transition-all duration-200 items-center text-center"
                      >
                        <div className="flex items-center gap-2 mb-1 justify-center w-full">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-200 text-blue-700 text-lg">
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-5 h-5'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' /></svg>
                          </span>
                          <span className="font-bold text-sm text-blue-800 truncate">{est.name || est.nombre || <span className='text-gray-400'>Sin nombre</span>}</span>
                        </div>
                        <div className="text-blue-700 text-xs break-all w-full">{est.email}</div>
                        <div className="flex gap-1 mt-2 justify-center w-full">
                          <button
                            onClick={() => handleEdit(est)}
                            className="w-16 h-7 px-0 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold flex items-center justify-center"
                          >Editar</button>
                          <button
                            onClick={() => handleDelete(est.id)}
                            className="w-16 h-7 px-0 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold flex items-center justify-center"
                          >Eliminar</button>
                        </div>
                        {editId === est.id && (
                          <div className="mt-2 flex flex-col gap-1 w-full items-center">
                            <input
                              name="name"
                              value={editData.name}
                              onChange={handleEditChange}
                              className="px-2 py-1 rounded border border-blue-200 w-full text-xs text-center"
                            />
                            <input
                              name="email"
                              value={editData.email}
                              onChange={handleEditChange}
                              className="px-2 py-1 rounded border border-blue-200 w-full text-xs text-center"
                            />
                            <select
                              name="subject"
                              value={editData.subject}
                              onChange={handleEditChange}
                              className="px-2 py-1 rounded border border-blue-200 w-full text-xs text-center"
                              required
                            >
                              <option value="" disabled>Selecciona materia</option>
                              {materias.map((mat) => (
                                <option key={mat.id} value={mat.nombre}>{mat.nombre}</option>
                              ))}
                            </select>
                            <div className="flex gap-1 mt-2 justify-center w-full">
                              <button
                                onClick={handleEditSave}
                                className="w-16 h-7 px-0 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold flex items-center justify-center"
                              >Guardar</button>
                              <button
                                onClick={() => setEditId(null)}
                                className="w-16 h-7 px-0 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs font-semibold flex items-center justify-center"
                              >Cancelar</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
