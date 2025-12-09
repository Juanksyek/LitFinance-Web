import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import type { Concepto, EditarConceptoRequest } from '../types/concepto';

interface ConceptoEditableProps {
  concepto: Concepto;
  onEdit: (data: EditarConceptoRequest) => Promise<void>;
  onDelete: () => void;
}

const ICONOS = ['📌', '💰', '🏠', '🍔', '🎬', '🎮', '✈️', '🚗', '❤️', '💡'];
const COLORES = [
  '#FF9800', '#F44336', '#2196F3', '#9C27B0',
  '#4CAF50', '#FF5722', '#00BCD4', '#3F51B5',
  '#FFC107', '#795548', '#9E9E9E', '#607D8B',
  '#673AB7', '#CDDC39', '#00BCD4'
];

export default function ConceptoEditable({ concepto, onEdit, onDelete }: ConceptoEditableProps) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(concepto.nombre);
  const [icono, setIcono] = useState(concepto.icono || '📌');
  const [color, setColor] = useState(concepto.color);
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    setLoading(true);
    await onEdit({ nombre, icono, color });
    setLoading(false);
    setEditando(false);
  };

  if (!editando) {
    return (
      <div
        className="relative p-3 rounded-xl border-2 transition-all group"
        style={{ borderColor: color, backgroundColor: `${color}20` }}
      >
        <div className="text-center">
          <div className="text-2xl mb-1">{icono}</div>
          <p className="text-sm font-medium text-white truncate">{nombre}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="absolute top-1 left-1 p-1 rounded-lg bg-primary/80 text-white opacity-0 group-hover:opacity-100 transition-all"
          title="Editar"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-1 right-1 p-1 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all"
          title="Eliminar"
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative p-3 rounded-xl border-2 transition-all"
      style={{ borderColor: color, backgroundColor: `${color}20` }}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Iconos */}
        <div className="flex flex-wrap gap-1 mb-1">
          {ICONOS.map(ic => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcono(ic)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg transition-all ${icono === ic ? 'bg-primary/20 ring-2 ring-primary' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {ic}
            </button>
          ))}
        </div>
        {/* Nombre */}
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm outline-none border border-white/20 focus:border-primary"
        />
        {/* Colores */}
        <div className="flex flex-wrap gap-1 mt-1">
          {COLORES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${color === c ? 'ring-2 ring-primary' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <button
          type="button"
          onClick={() => setEditando(false)}
          className="p-1 rounded-lg bg-white/10 text-white hover:bg-white/20"
        >
          <X size={14} />
        </button>
        <button
          type="button"
          onClick={handleGuardar}
          className="p-1 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
          disabled={loading || !nombre.trim()}
        >
          <Check size={14} />
        </button>
      </div>
    </div>
  );
}