import { useEffect, useState } from "react";
import {
  getCollection,
  addDocument,
  setDocument,
  deleteDocument,
} from "../services/firestoreService";
import AsideMenu from "./AsideMenu";
import Banner from "./Banner";
import { useAuth } from "../context/AuthContext";
import NotaFormModal from "./NotaFormModal";
import { useNavigate } from "react-router-dom";

// Ahora recibe menuAbierto, setMenuAbierto, role, logout como props
export default function MateriasList({
  menuAbierto,
  setMenuAbierto = () => {},
  role,
  logout,
}) {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nombre: "", descripcion: "", codigoSecreto: "" });
  const [newMateria, setNewMateria] = useState("");
  const [modalMateria, setModalMateria] = useState(null);
  const { user } = useAuth();
  const nombre = user?.displayName || user?.name || user?.nombre || user?.email;
  const [actionMsg, setActionMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterias();
    // eslint-disable-next-line
  }, []);

  async function fetchMaterias() {
    setLoading(true);
    const data = await getCollection("materias");
    setMaterias(data);
    setLoading(false);
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta materia?")) return;
    await deleteDocument("materias", id);
    setActionMsg("Materia eliminada");
    fetchMaterias();
  };

  const handleEdit = (mat) => {
    setEditId(mat.id);
    setEditData({
      nombre: mat.nombre,
      descripcion: mat.descripcion || "",
      codigoSecreto: mat.codigoSecreto || ""
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    await setDocument("materias", editId, {
      nombre: editData.nombre,
      descripcion: editData.descripcion,
      codigoSecreto: editData.codigoSecreto
    });
    setEditId(null);
    setActionMsg("Materia actualizada");
    fetchMaterias();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newMateria.trim()) return;
    await addDocument("materias", {
      nombre: newMateria.trim(),
      descripcion: "",
    });
    setNewMateria("");
    setActionMsg("Materia creada");
    fetchMaterias();
  };

  const filtered = materias.filter((mat) =>
    (mat.nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative">
      {/* Botón hamburguesa solo visible en móvil */}
      <button
        onClick={() => setMenuAbierto(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>
      {/* Overlay menú móvil controlado por el padre */}
      {/* El overlay debe estar en el componente padre, no aquí */}
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
            <form
              onSubmit={handleCreate}
              className="flex gap-2 w-full sm:w-auto"
            >
              <input
                type="text"
                placeholder="Nueva materia..."
                className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 w-full sm:w-64"
                value={newMateria}
                onChange={(e) => setNewMateria(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold shadow"
              >
                Crear
              </button>
            </form>
            <input
              type="text"
              placeholder="Buscar materia..."
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
              No hay materias registradas.
            </div>
          ) : (
            <div className="flex flex-wrap gap-10 justify-center">
              {filtered.map((mat, idx) => {
                // Paleta de colores pastel para variedad
                const colors = [
                  {
                    bg: "bg-yellow-100",
                    grad: "linear-gradient(135deg, #fef08a 70%, #fde68a 100%)",
                    pin: "text-yellow-400",
                  },
                  {
                    bg: "bg-pink-100",
                    grad: "linear-gradient(135deg, #fbcfe8 70%, #f9a8d4 100%)",
                    pin: "text-pink-400",
                  },
                  {
                    bg: "bg-blue-100",
                    grad: "linear-gradient(135deg, #bae6fd 70%, #7dd3fc 100%)",
                    pin: "text-blue-400",
                  },
                  {
                    bg: "bg-green-100",
                    grad: "linear-gradient(135deg, #bbf7d0 70%, #6ee7b7 100%)",
                    pin: "text-green-400",
                  },
                  {
                    bg: "bg-purple-100",
                    grad: "linear-gradient(135deg, #ddd6fe 70%, #c4b5fd 100%)",
                    pin: "text-purple-400",
                  },
                ];
                const color = colors[idx % colors.length];
                return (
                  <div
                    key={mat.id}
                    className={`rounded-3xl shadow-2xl p-8 w-72 h-72 flex flex-col justify-between relative transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${color.bg} group animate-materia-fade-in`}
                    style={{
                      boxShadow: "8px 16px 32px #00000022",
                      background: color.grad,
                    }}
                    onClick={() => editId !== mat.id && setModalMateria(mat.nombre)}
                    role="button"
                    tabIndex={0}
                  >
                    <span
                      className={`absolute right-6 top-6 ${color.pin} text-3xl group-hover:rotate-12 transition-transform duration-300`}
                    >
                      📌
                    </span>
                    {editId === mat.id ? (
                      <>
                        <input
                          name="nombre"
                          value={editData.nombre}
                          onChange={handleEditChange}
                          className="px-4 py-3 rounded-xl border border-blue-200 w-full mb-2 text-2xl font-bold focus:ring-2 focus:ring-blue-400 text-center"
                          autoFocus
                        />
                        <textarea
                          name="descripcion"
                          value={editData.descripcion || ""}
                          onChange={handleEditChange}
                          className="px-3 py-2 rounded-xl border border-blue-200 w-full mb-2 text-base focus:ring-2 focus:ring-blue-400 text-center resize-none min-h-[60px]"
                          placeholder="Descripción de la materia"
                        />
                        <input
                          name="codigoSecreto"
                          value={editData.codigoSecreto || ""}
                          onChange={handleEditChange}
                          className="px-3 py-2 rounded-xl border border-yellow-200 w-full mb-2 text-base focus:ring-2 focus:ring-yellow-400 text-center"
                          placeholder="Código secreto (token) de la materia"
                          maxLength={12}
                        />
                      </>
                    ) : (
                      <>
                        <div className="font-extrabold text-gray-800 text-3xl truncate mb-2 drop-shadow-sm text-center">
                          {mat.nombre}
                        </div>
                        <div className="text-gray-700 text-base text-center break-words line-clamp-3 mb-2 min-h-[60px]">
                          {mat.descripcion || (
                            <span className="italic text-gray-400">
                              Sin descripción
                            </span>
                          )}
                        </div>
                      </>
                    )}
                    <div className="flex gap-4 mt-auto justify-center">
                      {editId === mat.id ? (
                        <>
                          <button
                            onClick={handleEditSave}
                            className="w-20 px-2 py-1 bg-green-500 text-white rounded-xl hover:bg-green-600 text-base font-semibold shadow transition-colors duration-200"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="w-20 px-2 py-1 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 text-base font-semibold shadow transition-colors duration-200"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={e => { e.stopPropagation(); handleEdit(mat); }}
                            className="w-20 px-2 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-base font-semibold shadow transition-colors duration-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDelete(mat.id); }}
                            className="w-20 px-2 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 text-base font-semibold shadow transition-colors duration-200"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              navigate(`/notas-por-materia?materia=${encodeURIComponent(mat.nombre)}`);
                            }}
                            className="w-20 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-xl hover:bg-yellow-500 text-base font-semibold shadow transition-colors duration-200"
                          >
                            Ver notas
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <style>{`
                .animate-materia-fade-in { animation: materiaFadeIn 0.8s cubic-bezier(.4,2,.6,1) both; }
                @keyframes materiaFadeIn { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: none; } }
              `}</style>
            </div>
          )}
          {modalMateria && (
            <NotaFormModal
              materia={modalMateria}
              onClose={() => setModalMateria(null)}
              onSave={fetchMaterias}
            />
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
