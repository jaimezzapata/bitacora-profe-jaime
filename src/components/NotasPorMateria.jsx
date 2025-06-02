import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import AsideMenu from "./AsideMenu";
import {
  getCollection,
  updateDocument,
  deleteDocument,
} from "../services/firestoreService";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function NotasPorMateria(props) {
  const { user, role, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const materiaFiltrada = searchParams.get("materia");
  const nombre = user?.displayName || user?.name || user?.nombre || user?.email;
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agrupadas, setAgrupadas] = useState({});
  const [search, setSearch] = useState("");
  const [editNota, setEditNota] = useState(null);
  const [editForm, setEditForm] = useState({ titulo: "", descripcion: "" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState({});
  const [newNoteDesc, setNewNoteDesc] = useState({});
  const [savingNew, setSavingNew] = useState(false);
  const [allMaterias, setAllMaterias] = useState([]);

  useEffect(() => {
    async function fetchNotas() {
      setLoading(true);
      const data = await getCollection("notas");
      setNotas(data);
      setLoading(false);
    }
    fetchNotas();
  }, []);

  useEffect(() => {
    const agrupadasTemp = {};
    notas.forEach((nota) => {
      const key = nota.asignatura || "Sin asignatura";
      if (!agrupadasTemp[key]) agrupadasTemp[key] = [];
      agrupadasTemp[key].push(nota);
    });
    setAgrupadas(agrupadasTemp);
  }, [notas]);

  useEffect(() => {
    getCollection("materias").then(setAllMaterias);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta nota?")) return;
    await deleteDocument("notas", id);
    setNotas((prev) => prev.filter((n) => n.id !== id));
  };

  const handleEditClick = (nota) => {
    setEditNota(nota);
    setEditForm({ titulo: nota.titulo, descripcion: nota.descripcion || "" });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    await updateDocument("notas", editNota.id, {
      descripcion: editForm.descripcion,
    });
    setNotas((prev) =>
      prev.map((n) => (n.id === editNota.id ? { ...n, descripcion: editForm.descripcion } : n))
    );
    setEditNota(null);
    setSavingEdit(false);
  };

  const handleEditCancel = () => setEditNota(null);

  async function handleCreateNote(materiaSeleccionada) {
    setSavingNew(true);
    const materiaFinal = newNoteDesc.materia || materiaSeleccionada;
    await props?.addNote
      ? props.addNote(materiaFinal, newNoteDesc[materiaFinal])
      : (await import("../services/firestoreService")).addDocument("notas", {
          descripcion: newNoteDesc[materiaFinal],
          asignatura: materiaFinal,
          fecha: new Date().toISOString(),
        });
    setNewNoteDesc((prev) => ({ ...prev, [materiaFinal]: "", materia: "" }));
    setShowCreateForm((prev) => ({ ...prev, [materiaSeleccionada]: false }));
    setSavingNew(false);
    // Refrescar notas
    const data = await getCollection("notas");
    setNotas(data);
  }

  const materiasFiltradas = Object.keys(agrupadas).filter(
    (mat) =>
      mat.toLowerCase().includes(search.toLowerCase()) &&
      (!materiaFiltrada || mat === materiaFiltrada)
  );

  return (
    <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative">
      {/* Botón hamburguesa en móvil */}
      <button
        onClick={() => setMenuAbierto(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMenuAbierto(false)}
        ></div>
      )}
      <AsideMenu
        role={role}
        logout={logout}
        setMenuAbierto={setMenuAbierto}
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
          <div className="w-full bg-white/90 rounded-2xl shadow-xl p-3 sm:p-6 md:p-8">
            {materiaFiltrada && (
              <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Notas de la materia:{" "}
                <span className="underline decoration-blue-300">
                  {materiaFiltrada}
                </span>
              </h2>
            )}

            {materiasFiltradas.length === 0 ? (
              <div className="text-center text-gray-500 text-lg h-32 flex items-center justify-center">
                No hay notas registradas para esa materia.
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {materiasFiltradas.map((materia, idx) => {
                  const cardColors = [
                    {
                      bg: "bg-yellow-100",
                      grad: "linear-gradient(135deg, #fef08a 70%, #fde68a 100%)",
                      border: "border-yellow-300",
                      pin: "text-yellow-400",
                      accent: "bg-yellow-200 text-yellow-800 border-yellow-300",
                    },
                    {
                      bg: "bg-pink-100",
                      grad: "linear-gradient(135deg, #fbcfe8 70%, #f9a8d4 100%)",
                      border: "border-pink-300",
                      pin: "text-pink-400",
                      accent: "bg-pink-200 text-pink-800 border-pink-300",
                    },
                    {
                      bg: "bg-blue-100",
                      grad: "linear-gradient(135deg, #bae6fd 70%, #7dd3fc 100%)",
                      border: "border-blue-300",
                      pin: "text-blue-400",
                      accent: "bg-blue-200 text-blue-800 border-blue-300",
                    },
                    {
                      bg: "bg-green-100",
                      grad: "linear-gradient(135deg, #bbf7d0 70%, #6ee7b7 100%)",
                      border: "border-green-300",
                      pin: "text-green-400",
                      accent: "bg-green-200 text-green-800 border-green-300",
                    },
                    {
                      bg: "bg-purple-100",
                      grad: "linear-gradient(135deg, #ddd6fe 70%, #c4b5fd 100%)",
                      border: "border-purple-300",
                      pin: "text-purple-400",
                      accent: "bg-purple-200 text-purple-800 border-purple-300",
                    },
                  ];
                  const cardColor = cardColors[idx % cardColors.length];
                  return (
                    <section key={materia} className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-blue-800 text-left pl-2">{materia}</h3>
                        {role === "profesor" && (
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold shadow text-sm"
                            onClick={() => setShowCreateForm((prev) => ({ ...prev, [materia]: !prev[materia] }))}
                          >
                            {showCreateForm[materia] ? "Cancelar" : "Crear nota"}
                          </button>
                        )}
                      </div>
                      {showCreateForm[materia] && role === "profesor" && (
                        <form
                          className="mb-6 flex flex-col sm:flex-row gap-2 items-center"
                          onSubmit={e => {
                            e.preventDefault();
                            const materiaFinal = newNoteDesc.materia || materia;
                            if (!newNoteDesc[materiaFinal]) return; // No permitir guardar si no hay descripción
                            handleCreateNote(materiaFinal);
                          }}
                        >
                          <select
                            className="px-3 py-2 rounded-xl border border-blue-200 w-full sm:w-64 text-base focus:ring-2 focus:ring-blue-400"
                            value={newNoteDesc.materia || materia}
                            onChange={e => setNewNoteDesc((prev) => ({ ...prev, materia: e.target.value }))}
                            required
                          >
                            <option value="" disabled>Selecciona materia</option>
                            {allMaterias.map((mat) => (
                              <option key={mat.id} value={mat.nombre}>{mat.nombre}</option>
                            ))}
                          </select>
                          <textarea
                            className="px-3 py-2 rounded-xl border border-blue-200 w-full sm:w-96 text-base focus:ring-2 focus:ring-blue-400"
                            placeholder="Descripción de la nota..."
                            value={newNoteDesc[newNoteDesc.materia || materia] || ""}
                            onChange={e => setNewNoteDesc((prev) => ({ ...prev, [newNoteDesc.materia || materia]: e.target.value }))}
                            required
                            rows={2}
                            maxLength={200}
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold shadow"
                            disabled={savingNew}
                          >
                            Guardar
                          </button>
                        </form>
                      )}
                      <div className="flex flex-wrap gap-6 justify-start">
                        {agrupadas[materia].map((nota, nidx) => {
                          if (editNota && editNota.id === nota.id) {
                            // Modal/inline edición
                            return (
                              <div
                                key={nota.id}
                                className={`relative w-[280px] h-[280px] flex flex-col items-center justify-center rounded-2xl border-2 shadow-lg bg-white z-50 ${cardColor.border}`}
                                style={{ boxShadow: "0 8px 32px #0001" }}
                              >
                                <form
                                  onSubmit={handleEditSave}
                                  className="w-full flex flex-col items-center gap-2 px-4"
                                >
                                  <textarea
                                    name="descripcion"
                                    value={editForm.descripcion}
                                    onChange={handleEditChange}
                                    className="w-full px-2 py-1 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 text-base"
                                    placeholder="Descripción"
                                    rows={5}
                                    maxLength={200}
                                    autoFocus
                                  />
                                  <div className="flex gap-2 mb-3 w-full px-4 justify-center">
                                    <button
                                      type="submit"
                                      className="w-20 px-2 py-1 bg-green-500 text-white rounded-xl hover:bg-green-600 text-base font-semibold shadow transition-colors duration-200"
                                      disabled={savingEdit}
                                    >
                                      Guardar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleEditCancel}
                                      className="w-20 px-2 py-1 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 text-base font-semibold shadow transition-colors duration-200"
                                      disabled={savingEdit}
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </form>
                              </div>
                            );
                          }
                          return (
                            <div
                              key={nota.id}
                              className={`relative ${cardColor.bg} ${cardColor.border} rounded-2xl shadow-xl flex flex-col items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-2xl border-2`}
                              style={{
                                background: cardColor.grad,
                                boxShadow: "0 8px 32px #0002",
                                width: "280px",
                                height: "280px",
                              }}
                            >
                              {/* Fecha de creación en la esquina superior derecha */}
                              {nota.fecha && (
                                <span className="absolute top-3 right-5 text-blue-700 text-xl font-bold opacity-80 select-none">
                                  {new Date(nota.fecha).toLocaleDateString()}
                                </span>
                              )}
                              {/* Pin decorativo */}
                              <span
                                className={`absolute -top-4 left-1/2 -translate-x-1/2 ${cardColor.pin} text-3xl rotate-12 select-none drop-shadow-lg`}
                              >
                                📎
                              </span>
                              {/* Contenido */}
                              <div className="w-full flex flex-col items-center mt-6 px-2 flex-1 justify-center">
                                {/* Descripción más grande */}
                                {nota.descripcion && (
                                  <div className="text-gray-700 text-lg text-center italic opacity-80 w-full mb-1 break-words whitespace-pre-line overflow-y-auto max-h-32">
                                    {nota.descripcion}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm border animate-bounce-slow ${cardColor.accent}`}
                                  >
                                    Tip
                                  </span>
                                </div>
                              </div>
                              {/* Botones de acción */}
                              <div className="flex gap-2 mb-3 w-full px-4 justify-center">
                                <button
                                  className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  title="Editar nota"
                                  onClick={() => handleEditClick(nota)}
                                >
                                  <i className="bi bi-pencil-fill text-sm"></i>
                                </button>
                                <button
                                  className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                                  title="Eliminar nota"
                                  onClick={() => handleDelete(nota.id)}
                                >
                                  <i className="bi bi-trash-fill text-sm"></i>
                                </button>
                              </div>

                              {/* Sombra inferior animada */}
                              <span className="absolute left-1/2 -translate-x-1/2 bottom-2 w-24 h-4 bg-black/10 rounded-full blur-md opacity-30 animate-pulse"></span>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
