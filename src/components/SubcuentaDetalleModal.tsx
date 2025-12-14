import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, FingerprintIcon, Wallet, User, Search, ChevronLeft, ChevronRight, Edit2, Trash2, PauseCircle, PlayCircle, PieChart, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Subcuenta } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subcuenta: Subcuenta | null;
  onEdit?: (subcuenta: Subcuenta) => void;
  onDelete?: (id: string) => void;
  onToggleEstado?: (subcuenta: Subcuenta) => void;
}

interface HistorialItem {
  _id: string;
  descripcion: string;
  createdAt: string;
  datos?: Record<string, { antes?: unknown; despues?: unknown } | unknown>;
}

export default function SubcuentaDetalleModal({ isOpen, onClose, subcuenta, onEdit, onDelete, onToggleEstado }: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [estadoLocal, setEstadoLocal] = useState(subcuenta?.activa ?? false);

  // Sincronizar estado local con prop
  useEffect(() => {
    if (subcuenta) {
      setEstadoLocal(subcuenta.activa);
    }
  }, [subcuenta]);

  const { data: historialData, isLoading: loadingHistorial } = useQuery({
    queryKey: ['subcuenta_historial', subcuenta?.subCuentaId, pagina, busqueda],
    queryFn: async () => {
      if (!subcuenta?.subCuentaId) return { resultados: [], totalPaginas: 1 };
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams({
        desde: '2024-01-01',
        hasta: '2026-01-01',
        limite: '5',
        pagina: String(pagina),
      });
      if (busqueda.trim()) params.append('descripcion', busqueda.trim());

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'https://litfinance-api-production.up.railway.app'}/subcuenta/${subcuenta.subCuentaId}/historial?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) return { resultados: [], totalPaginas: 1 };
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const inicio = (pagina - 1) * 5;
        const fin = inicio + 5;
        return { resultados: data.slice(inicio, fin), totalPaginas: Math.ceil(data.length / 5) };
      }
      return { resultados: data.resultados || [], totalPaginas: data.totalPaginas || 1 };
    },
    enabled: isOpen && !!subcuenta?.subCuentaId,
    staleTime: 1000 * 30,
  });

  const subcuentaExt = subcuenta as Subcuenta & { cuentaId?: string; userId?: string; afectaCuenta?: boolean };

  const { data: participacion } = useQuery({
    queryKey: ['subcuenta_participacion', subcuentaExt?.cuentaId, subcuenta?._id],
    queryFn: async () => {
      if (!subcuentaExt?.cuentaId || !subcuenta?._id) return null;
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'https://litfinance-api-production.up.railway.app'}/subcuenta/participacion/${subcuentaExt.cuentaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) return null;
      const data = await response.json();
      if (Array.isArray(data)) {
        const actual = data.find((item: { subsubCuentaId?: string; porcentaje?: number }) => item.subsubCuentaId === subcuenta._id);
        return actual?.porcentaje || null;
      }
      return null;
    },
    enabled: isOpen && !!subcuentaExt?.cuentaId && !!subcuenta?._id,
    staleTime: 1000 * 60,
  });

  const historial = historialData?.resultados || [];
  const totalPaginas = historialData?.totalPaginas || 1;

  if (!subcuenta) return null;

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== 'number') return '—';
    return amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-black/10 dark:border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex-1 text-center">
                <h2 className="text-xl font-bold text-content">{subcuenta.nombre}</h2>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                  estadoLocal ? 'bg-orange-500/10 text-orange-600' : 'bg-red-500/10 text-red-600'
                }`}>
                  {estadoLocal ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-content/5 rounded-xl transition-all">
                <X size={24} className="text-content" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-primary/10 to-orange-500/10 dark:from-primary/20 dark:to-orange-500/20 rounded-2xl p-6 border border-primary/20">
                <p className="text-sm font-semibold text-content/60 text-center mb-2">Saldo actual</p>
                <div className="flex items-end justify-center gap-2">
                  <span className="text-2xl font-bold text-content">{subcuenta.simbolo || '$'}</span>
                  <h3 className="text-4xl font-bold text-content">{formatCurrency(subcuenta.cantidad)}</h3>
                  <span className="text-lg text-content/60 mb-1">{subcuenta.moneda}</span>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-900" style={{ backgroundColor: subcuenta.color || '#9CA3AF' }} />
                  <span className="text-sm text-content/60">Color de identificación</span>
                </div>
              </div>

              {/* Quick Actions - Ingreso/Egreso/Recurrente */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    const event = new CustomEvent('openMovementModal', { 
                      detail: { tipo: 'ingreso', subcuentaId: subcuenta.subCuentaId || subcuenta._id } 
                    });
                    window.dispatchEvent(event);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <TrendingUp size={20} className="text-green-600" />
                  <span className="text-xs font-semibold text-green-600">Ingreso</span>
                </button>
                <button
                  onClick={() => {
                    const event = new CustomEvent('openMovementModal', { 
                      detail: { tipo: 'egreso', subcuentaId: subcuenta.subCuentaId || subcuenta._id } 
                    });
                    window.dispatchEvent(event);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all"
                >
                  <TrendingDown size={20} className="text-red-600" />
                  <span className="text-xs font-semibold text-red-600">Egreso</span>
                </button>
                <button
                  onClick={() => {
                    const event = new CustomEvent('openRecurrenteModal', { 
                      detail: { subcuentaId: subcuenta.subCuentaId || subcuenta._id } 
                    });
                    window.dispatchEvent(event);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all"
                >
                  <RefreshCw size={20} className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600">Recurrente</span>
                </button>
              </div>

              {/* Management Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => onEdit?.(subcuenta)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-black/10 dark:border-white/10 hover:border-primary/30 transition-all"
                >
                  <Edit2 size={20} className="text-content" />
                  <span className="text-xs font-semibold text-content">Editar</span>
                </button>
                <button
                  onClick={() => {
                    onToggleEstado?.(subcuenta);
                    setEstadoLocal(!estadoLocal);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-black/10 dark:border-white/10 hover:border-primary/30 transition-all"
                >
                  {estadoLocal ? <PauseCircle size={20} className="text-content" /> : <PlayCircle size={20} className="text-content" />}
                  <span className="text-xs font-semibold text-content">{estadoLocal ? 'Desactivar' : 'Activar'}</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all"
                >
                  <Trash2 size={20} className="text-red-600" />
                  <span className="text-xs font-semibold text-red-600">Eliminar</span>
                </button>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-black/10 dark:border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-3">
                    <TrendingUp size={18} className="text-orange-600" />
                  </div>
                  <p className="text-xs font-semibold text-content/60 mb-1">Impacto en cuenta</p>
                  <p className="text-sm font-bold text-content">{subcuentaExt.afectaCuenta ? 'Sí afecta' : 'No afecta'}</p>
                  <p className="text-xs text-content/50 mt-1">{subcuentaExt.afectaCuenta ? 'Modifica saldo principal' : 'Independiente'}</p>
                </div>
                <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-black/10 dark:border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-3">
                    <FingerprintIcon size={18} className="text-orange-600" />
                  </div>
                  <p className="text-xs font-semibold text-content/60 mb-1">ID Subcuenta</p>
                  <p className="text-sm font-bold text-content truncate">{subcuenta.subCuentaId?.slice(-8) || '—'}</p>
                  <p className="text-xs text-content/50 mt-1">Identificador único</p>
                </div>
              </div>

              {/* Participación */}
              {participacion !== null && participacion !== undefined && typeof participacion === 'number' && (
                <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20">
                      <PieChart size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-content/60">Participación</p>
                      <p className="text-2xl font-bold text-content">{participacion.toFixed(1)}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-content/50">Proporción en el total de subcuentas activas</p>
                </div>
              )}

              {/* Account Info */}
              <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-black/10 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-orange-600" />
                  <span className="text-sm font-semibold text-content/60 w-32">Usuario</span>
                  <span className="text-sm font-bold text-content flex-1 truncate">{subcuentaExt.userId?.slice(-12) || '—'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wallet size={18} className="text-orange-600" />
                  <span className="text-sm font-semibold text-content/60 w-32">Cuenta principal</span>
                  <span className="text-sm font-bold text-content flex-1 truncate">{subcuentaExt.cuentaId?.slice(-8) || 'No asignada'}</span>
                </div>
              </div>

              {/* Historial */}
              <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-black/10 dark:border-white/10">
                <h3 className="text-lg font-bold text-content mb-4">Historial de movimientos</h3>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => {
                      setBusqueda(e.target.value);
                      setPagina(1);
                    }}
                    placeholder="Buscar en historial..."
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
                  />
                </div>

                {/* History List */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {loadingHistorial ? (
                    <div className="text-center py-8 text-content/60">Cargando...</div>
                  ) : historial.length === 0 ? (
                    <div className="text-center py-8 text-content/60">
                      <p className="font-semibold mb-2">No hay movimientos registrados</p>
                      <p className="text-sm">Los movimientos aparecerán aquí cuando se realicen</p>
                    </div>
                  ) : (
                    historial.map((item: HistorialItem) => (
                      <div key={item._id} className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-content text-sm">{item.descripcion}</p>
                          <p className="text-xs text-content/60">{formatDate(item.createdAt)}</p>
                        </div>
                        {item.datos && Object.keys(item.datos).length > 0 && (
                          <div className="space-y-1">
                            {Object.entries(item.datos).map(([clave, valor]: [string, unknown]) => {
                              const claveLabel = clave.charAt(0).toUpperCase() + clave.slice(1);
                              const valorObj = valor as { antes?: unknown; despues?: unknown } | null;
                              if (valorObj && typeof valorObj === 'object' && 'antes' in valorObj && 'despues' in valorObj) {
                                return (
                                  <p key={clave} className="text-xs text-content/60">
                                    {claveLabel}: <span className="font-semibold text-content">{String(valorObj.antes)}</span> → <span className="font-semibold text-content">{String(valorObj.despues)}</span>
                                  </p>
                                );
                              }
                              return (
                                <p key={clave} className="text-xs text-content/60">
                                  {claveLabel}: <span className="font-semibold text-content">{JSON.stringify(valor)}</span>
                                </p>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {historial.length > 0 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                    <button
                      onClick={() => setPagina((prev) => Math.max(1, prev - 1))}
                      disabled={pagina === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                        pagina === 1
                          ? 'bg-content/5 text-content/40 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      <ChevronLeft size={16} />
                      Anterior
                    </button>
                    <span className="text-sm font-medium text-content">
                      Página {pagina} de {totalPaginas}
                    </span>
                    <button
                      onClick={() => setPagina((prev) => Math.min(totalPaginas, prev + 1))}
                      disabled={pagina === totalPaginas}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                        pagina === totalPaginas
                          ? 'bg-content/5 text-content/40 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      Siguiente
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 rounded-3xl"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-sm w-full"
                  >
                    <h3 className="text-lg font-bold text-content mb-2">Eliminar subcuenta</h3>
                    <p className="text-sm text-content/60 mb-6">¿Estás seguro de que deseas eliminar esta subcuenta? Esta acción no se puede deshacer.</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-2 rounded-xl bg-content/5 hover:bg-content/10 text-content font-semibold transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          onDelete?.(subcuenta.subCuentaId || subcuenta._id || '');
                          setShowDeleteConfirm(false);
                          onClose();
                        }}
                        className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
