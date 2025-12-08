import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, X, Trash2 } from 'lucide-react';
import { listarConceptos, crearConcepto, eliminarConcepto } from '../services/conceptoService';
import type { Concepto } from '../types/concepto';

interface SelectorConceptoProps {
  onSelect: (concepto: string) => void;
  placeholder?: string;
}

const CONCEPTOS_PREDEFINIDOS = [
  { nombre: 'Viajes', icono: '✈️', color: '#2196F3' },
  { nombre: 'Carro', icono: '🚗', color: '#F44336' },
  { nombre: 'Novia', icono: '❤️', color: '#E91E63' },
  { nombre: 'Juegos', icono: '🎮', color: '#9C27B0' },
  { nombre: 'Dinerillo', icono: '🌿', color: '#4CAF50' },
  { nombre: 'Luz', icono: '💡', color: '#FFC107' },
];

export default function SelectorConcepto({ 
  onSelect, 
  placeholder = 'Busca o escribe un concepto rápido'
}: SelectorConceptoProps) {
  const [conceptosUsuario, setConceptosUsuario] = useState<Concepto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [nuevoConcepto, setNuevoConcepto] = useState({ nombre: '', icono: '📌', color: '#FF9800' });

  useEffect(() => {
    cargarConceptos();
  }, []);

  const cargarConceptos = async () => {
    try {
      console.log('🔄 SelectorConcepto - Cargando conceptos...');
      const response = await listarConceptos({ limit: 50 });
      console.log('✅ SelectorConcepto - Respuesta:', response);
      console.log('📊 SelectorConcepto - Conceptos:', response.conceptos);
      setConceptosUsuario(response.conceptos || []);
    } catch (error) {
      console.error('❌ SelectorConcepto - Error cargando conceptos:', error);
      setConceptosUsuario([]);
    }
  };

  const handleCrearConcepto = async () => {
    if (!nuevoConcepto.nombre.trim()) return;

    try {
      await crearConcepto({
        nombre: nuevoConcepto.nombre,
        icono: nuevoConcepto.icono,
        color: nuevoConcepto.color
      });
      await cargarConceptos();
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
      await cargarConceptos();
    } catch (error) {
      console.error('Error eliminando concepto:', error);
      alert('Error al eliminar concepto');
    }
  };

  const conceptosCombinados = [
    ...CONCEPTOS_PREDEFINIDOS,
    ...conceptosUsuario.map(c => ({ nombre: c.nombre, icono: c.icono || '📌' }))
  ];

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

      {/* Conceptos predefinidos y del usuario */}
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
            {conceptosCombinados
              .filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
              .map((concepto, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelect(concepto.nombre);
                    setBusqueda(concepto.nombre);
                  }}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all flex items-center gap-1"
                >
                  <span>{concepto.icono}</span>
                  <span>{concepto.nombre}</span>
                </motion.button>
              ))}
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
                  <div
                    key={concepto.id}
                    className="relative p-3 rounded-xl border-2 transition-all group"
                    style={{ 
                      borderColor: concepto.color,
                      backgroundColor: `${concepto.color}20`
                    }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{concepto.icono}</div>
                      <p className="text-sm font-medium text-white truncate">{concepto.nombre}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminarConcepto(concepto.id)}
                      className="absolute top-1 right-1 p-1 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
