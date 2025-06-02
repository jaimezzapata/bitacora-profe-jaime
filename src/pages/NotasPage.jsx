import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import NotasPorMateria from '../components/NotasPorMateria';

export default function NotasPage() {
  const { role } = useAuth();
  const [editingNota, setEditingNota] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (nota) => setEditingNota(nota);
  const handleSave = () => {
    setEditingNota(null);
    setRefresh(r => !r);
  };
  const handleCancel = () => setEditingNota(null);

  // Si es profesor, mostrar NotasPorMateria
  if (role === 'profesor') {
    return <NotasPorMateria />;
  }

  // Si es estudiante, mostrar solo sus notas (puedes personalizar esto)
  return (
    <div>
      <h1>Notas</h1>
      {/* Aquí podrías mostrar un componente de notas para estudiantes si lo deseas */}
    </div>
  );
}
