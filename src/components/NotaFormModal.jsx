import { useState } from "react";
import { addDocument } from "../services/firestoreService";

export default function NotaFormModal({ materia, onClose, onSave }) {
  const [form, setForm] = useState({ descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addDocument("notas", {
        descripcion: form.descripcion,
        asignatura: materia,
        fecha: new Date().toISOString(),
      });
      onSave && onSave();
      onClose();
    } catch (err) {
      setError("Error al guardar la nota");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in flex flex-col gap-4 relative">
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold">×</button>
        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Registrar nota</h2>
        <p className="text-blue-400 text-sm text-center mb-2">Escribe la nota para la materia <span className="font-semibold">{materia}</span></p>
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1 flex items-center gap-2">
            <span className="text-xl">📝</span> Nota
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 transition-all min-h-[100px]"
            placeholder="Escribe la nota..."
            maxLength={400}
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-2 animate-shake">{error}</div>}
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-all">Cancelar</button>
          <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition-all duration-200">
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
