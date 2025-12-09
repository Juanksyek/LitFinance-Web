import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, X } from 'lucide-react';
import { listarConceptos, crearConcepto, eliminarConcepto, editarConcepto } from '../services/conceptoService';
import type { Concepto, EditarConceptoRequest } from '../types/concepto';
import ConceptoEditable from './ConceptoEditable';

interface SelectorConceptoProps {
  onSelect: (concepto: string) => void;
  placeholder?: string;
}



export default function SelectorConcepto({ 
  onSelect, 
  placeholder = 'Busca o escribe un concepto rápido'
}: SelectorConceptoProps) {
  const [conceptosUsuario, setConceptosUsuario] = useState<Concepto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [nuevoConcepto, setNuevoConcepto] = useState({ nombre: '', icono: '📌', color: '#FF9800' });


  useEffect(() => {
    // Definir la función dentro del useEffect para evitar advertencias de dependencias
    const cargarConceptos = async () => {
      try {
        // Se puede ajustar el limit y skip para paginación futura
        const response = await listarConceptos({ limit: 50, search: busqueda });
        // Forzamos el tipado para evitar error de compilación
        const conceptos = (response as { resultados?: Concepto[]; conceptos?: Concepto[] }).resultados || (response as { resultados?: Concepto[]; conceptos?: Concepto[] }).conceptos || [];
        setConceptosUsuario(conceptos);
      } catch {
        setConceptosUsuario([]);
      }
    };
    cargarConceptos();
  }, [busqueda]);



  const handleCrearConcepto = async () => {
    if (!nuevoConcepto.nombre.trim()) return;

    try {
      await crearConcepto({
        nombre: nuevoConcepto.nombre,
        icono: nuevoConcepto.icono,
        color: nuevoConcepto.color
      });
      // Recargar conceptos tras crear
      const response = await listarConceptos({ limit: 50, search: busqueda });
      const conceptos = (response as { resultados?: Concepto[]; conceptos?: Concepto[] })?.resultados || response?.conceptos || [];
      setConceptosUsuario(conceptos);
      setMostrarCrear(false);
      setNuevoConcepto({ nombre: '', icono: '📌', color: '#FF9800' });
      onSelect(nuevoConcepto.nombre);
    } catch (error) {
      console.error('Error creando concepto:', error);
      alert('Error al crear concepto');
    }
  };

  const handleEliminarConcepto = async (conceptoId: string) => {
    if (!window.confirm('¿Eliminar este concepto?')) return;

    try {
      await eliminarConcepto(conceptoId);
      // Recargar conceptos tras eliminar
      const response = await listarConceptos({ limit: 50, search: busqueda });
      const conceptos = (response as { resultados?: Concepto[]; conceptos?: Concepto[] })?.resultados || response?.conceptos || [];
      setConceptosUsuario(conceptos);
    } catch (error) {
      console.error('Error eliminando concepto:', error);
      alert('Error al eliminar concepto');
    }
  };



  return (
    <div>
      {/* Input de búsqueda */}
      <div className="relative mb-3">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSelect(busqueda);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
        />
      </div>

      {/* Solo conceptos del usuario */}
      {!mostrarCrear && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-content">Tus conceptos</label>
            <button
              type="button"
              onClick={() => setMostrarCrear(true)}
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              <Plus size={14} />
              Conceptos
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {conceptosUsuario.length > 0 ? (
              conceptosUsuario.map((concepto) => (
                <motion.button
                  key={concepto._id || concepto.conceptoId || concepto.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelect(concepto.nombre);
                    setBusqueda(concepto.nombre);
                  }}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all flex items-center gap-1"
                  style={{ border: `2px solid ${concepto.color || '#FF9800'}` }}
                >
                  <span>{concepto.icono || '📌'}</span>
                  <span>{concepto.nombre}</span>
                </motion.button>
              ))
            ) : (
              <span className="text-content/50 text-sm">No tienes conceptos aún.</span>
            )}
          </div>
        </div>
      )}

      {/* Formulario crear concepto */}
      {mostrarCrear && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-neutral-900 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">Mis Conceptos</h4>
            <button
              type="button"
              onClick={() => setMostrarCrear(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-all"
            >
              <X size={18} className="text-white/60" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Campo de búsqueda dentro del modal */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Buscar concepto..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all text-white placeholder:text-white/40"
              />
            </div>

            {/* Nuevo concepto */}
            <div className="flex gap-2">
              <input
                type="text"
                value={nuevoConcepto.nombre}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, nombre: e.target.value })}
                placeholder="Nuevo concepto"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all text-white placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={handleCrearConcepto}
                className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div>
              <p className="text-xs text-white/60 mb-2">Símbolo:</p>
              <div className="flex flex-wrap gap-2">
                {['📌', '💰', '🏠', '🍔', '🎬', '🎮', '✈️', '🚗', '❤️', '💡'].map(icono => (
                  <button
                    key={icono}
                    type="button"
                    onClick={() => setNuevoConcepto({ ...nuevoConcepto, icono })}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      nuevoConcepto.icono === icono
                        ? 'bg-primary/20 ring-2 ring-primary'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {icono}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-white/60 mb-2">Color:</p>
              <div className="grid grid-cols-8 gap-2">
                {[
                  '#FF9800', '#F44336', '#2196F3', '#9C27B0',
                  '#4CAF50', '#FF5722', '#00BCD4', '#3F51B5',
                  '#FFC107', '#795548', '#9E9E9E', '#607D8B',
                  '#673AB7', '#CDDC39', '#00BCD4'
                ].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNuevoConcepto({ ...nuevoConcepto, color })}
                    className={`w-10 h-10 rounded-full transition-all ${
                      nuevoConcepto.color === color
                        ? 'ring-2 ring-offset-2 ring-primary ring-offset-neutral-900'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Lista de conceptos del usuario */}
            {conceptosUsuario.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {conceptosUsuario.map((concepto) => (
                  <ConceptoEditable
                    key={concepto._id || concepto.conceptoId || concepto.id}
                    concepto={concepto}
                    onEdit={async (nuevo: EditarConceptoRequest) => {
                      const id = concepto._id || concepto.conceptoId || concepto.id || '';
                      if (!id) return;
                      await editarConcepto(id, nuevo);
                      // Recargar conceptos tras editar
                      const response = await listarConceptos({ limit: 50, search: busqueda });
                      const conceptos = (response as { resultados?: Concepto[]; conceptos?: Concepto[] })?.resultados || response?.conceptos || [];
                      setConceptosUsuario(conceptos);
                    }}
                    onDelete={() => {
                      const id = concepto._id || concepto.conceptoId || concepto.id || '';
                      if (!id) return;
                      handleEliminarConcepto(id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
