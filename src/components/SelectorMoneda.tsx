import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { obtenerCuentaPrincipal } from '../services/cuentaService';
import { apiRequest } from '../services/monedaService';
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
  onSelect
}: SelectorMonedaProps) {
  const [favoritas, setFavoritas] = useState<Moneda[]>([]);
  const [otras, setOtras] = useState<Moneda[]>([]);
  const [monedaPrincipal, setMonedaPrincipal] = useState<Moneda | null>(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const filterFn = (m: Moneda) => {
    if (!busqueda.trim()) return true;
    const s = busqueda.trim().toLowerCase();
    return (
      m.nombre.toLowerCase().includes(s) ||
      m.codigo.toLowerCase().includes(s) ||
      (m.simbolo || '').toLowerCase().includes(s)
    );
  };

  const favoritasFiltradas = favoritas.filter(filterFn);
  const otrasFiltradas = otras.filter(filterFn);

  useEffect(() => {
    if (isOpen) {
      cargarMonedas();
    }
  }, [isOpen]);

  const cargarMonedas = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ favoritas: Moneda[]; otras: Moneda[]; total: number; totalFavoritas: number }>(
        '/monedas',
        { method: 'GET' }
      );
      setFavoritas((res.favoritas || []).sort((a: Moneda, b: Moneda) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })));
      setOtras((res.otras || []).sort((a: Moneda, b: Moneda) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })));
      const cuenta = await obtenerCuentaPrincipal();
      if (cuenta && cuenta.moneda && cuenta.simbolo) {
        setMonedaPrincipal({
          id: cuenta.id || cuenta._id || 'principal',
          codigo: cuenta.moneda,
          nombre: cuenta.moneda,
          simbolo: cuenta.simbolo,
        });
      }
    } catch (error) {
      console.error('Error cargando monedas:', error);
      setFavoritas([]);
      setOtras([]);
      setMonedaPrincipal(null);
    } finally {
      setLoading(false);
    }
  };

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
              ) : (
                <div className="space-y-2">
                  {monedaPrincipal && (
                    <motion.button
                      key={monedaPrincipal.codigo}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelect(monedaPrincipal);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all bg-primary/20 border-2 border-primary`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {monedaPrincipal.simbolo}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-white">
                            {monedaPrincipal.nombre} ({monedaPrincipal.codigo})
                          </p>
                          <p className="text-xs text-white/60">{monedaPrincipal.simbolo} Moneda principal</p>
                        </div>
                      </div>
                    </motion.button>
                  )}
                  {favoritasFiltradas.length > 0 && (
                    <>
                      <p className="text-xs text-white/40 px-2 mb-2">★ Favoritas ({favoritasFiltradas.length})</p>
                      {favoritasFiltradas.map((moneda: Moneda) => (
                        <motion.button
                          key={moneda.codigo}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            onSelect(moneda);
                            onClose();
                          }}
                          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all bg-white/5 border border-white/10 hover:bg-white/10`}
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
                    </>
                  )}
                  {otrasFiltradas.length > 0 && (
                    <>
                      <p className="text-xs text-white/40 px-2 mb-2">$ Todas ({otrasFiltradas.length})</p>
                      {otrasFiltradas.map((moneda: Moneda) => (
                        <motion.button
                          key={moneda.codigo}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            onSelect(moneda);
                            onClose();
                          }}
                          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all bg-white/5 border border-white/10 hover:bg-white/10`}
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
                    </>
                  )}
                  {favoritasFiltradas.length === 0 && otrasFiltradas.length === 0 && !monedaPrincipal && (
                    <div className="text-center py-8">
                      <p className="text-white/60">No se encontraron monedas</p>
                    </div>
                  )}
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
