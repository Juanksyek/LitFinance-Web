import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { listarMonedas } from '../services/monedaService';
import type { Moneda } from '../types/moneda';

interface SelectorMonedaProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (moneda: Moneda) => void;
  monedaActual?: Moneda;
}

export default function SelectorMoneda({ 
  isOpen, 
  onClose, 
  onSelect,
  monedaActual 
}: SelectorMonedaProps) {
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (isOpen) {
      cargarMonedas();
    }
  }, [isOpen]);

  const cargarMonedas = async () => {
    try {
      setLoading(true);
      const data = await listarMonedas();
      setMonedas(data);
    } catch (error) {
      console.error('Error cargando monedas:', error);
      setMonedas([]);
    } finally {
      setLoading(false);
    }
  };

  const monedasFiltradas = (monedas || []).filter(m => 
    m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="relative w-full max-w-md mx-4 bg-neutral-900 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Selecciona una moneda</h3>
            
            {/* Búsqueda */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Busca por nombre o código..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary transition-all text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Lista de monedas */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-white/60">Cargando monedas...</p>
              </div>
            ) : monedasFiltradas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/60">No se encontraron monedas</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-white/40 px-2 mb-2">
                  {monedasFiltradas.length === monedas.length ? 'Todas' : 'Filtradas'} ({monedasFiltradas.length})
                </p>
                {monedasFiltradas.map((moneda) => (
                  <motion.button
                    key={moneda.codigo}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelect(moneda);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      monedaActual?.codigo === moneda.codigo
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {moneda.simbolo}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">
                          {moneda.nombre} ({moneda.codigo})
                        </p>
                        <p className="text-xs text-white/60">{moneda.simbolo}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
