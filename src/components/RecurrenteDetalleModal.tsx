import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Repeat, TrendingUp, FingerprintIcon, Layers, Play, Pause, Trash2, Edit2, AlarmClock, CheckCircle2 } from 'lucide-react';
import type { Recurrente } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recurrente: Recurrente | null;
  onEdit?: (recurrente: Recurrente) => void;
  onDelete?: (id: string) => void;
  onToggleEstado?: (recurrente: Recurrente) => void;
}

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const obtenerDescripcionFrecuencia = (tipo: string, valor: string): string => {
  switch (tipo) {
    case 'dia_mes': return `Cada día ${valor} del mes`;
    case 'dia_semana': return `Cada ${DIAS_SEMANA[parseInt(valor, 10)] || 'día desconocido'}`;
    case 'fecha_fija': {
      const [dia, mes] = valor.split('-');
      const i = parseInt(mes, 10) - 1;
      return `Cada ${dia} de ${MESES[i] || 'mes'}`;
    }
    case 'dias': return `Cada ${valor} días`;
    default: return 'Frecuencia desconocida';
  }
};

const formatearFechaLocal = (iso: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return 'Fecha no válida';
  }
};

const daysUntil = (iso: string): number => {
  try {
    const now = new Date();
    const target = new Date(iso);
    const diff = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / 86400000));
  } catch {
    return 0;
  }
};

const estimatedCycleDays = (tipo: string, valor: string) => {
  if (tipo === 'dia_semana') return 7;
  if (tipo === 'dia_mes') return 30;
  if (tipo === 'fecha_fija') return 365;
  if (tipo === 'dias') return Number.isFinite(+valor) && +valor > 0 ? +valor : 30;
  return 30;
};

export default function RecurrenteDetalleModal({ isOpen, onClose, recurrente, onEdit, onDelete, onToggleEstado }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!recurrente) return null;

  const proximaEjecucion = (recurrente as unknown as { proximaEjecucion?: string; nextExecution?: string }).proximaEjecucion || 
    (recurrente as unknown as { proximaEjecucion?: string; nextExecution?: string }).nextExecution || 
    new Date().toISOString();
  const diasRestantes = daysUntil(proximaEjecucion);
  const ciclo = estimatedCycleDays(recurrente.frecuenciaTipo, recurrente.frecuenciaValor);
  const progreso = Math.min(1, Math.max(0, 1 - diasRestantes / ciclo));

  const getPlatformColor = () => {
    if (recurrente.plataforma?.color) return recurrente.plataforma.color;
    const name = (recurrente.plataforma?.nombre || '').toLowerCase();
    const map: Record<string, string> = {
      netflix: '#E50914', spotify: '#1DB954', amazon: '#FF9900', hbo: '#5A2D82', disney: '#113CCF',
      youtube: '#FF0000', apple: '#A2AAAD', claro: '#E60000', izzi: '#FF7F00', telmex: '#0072CE',
    };
    return map[name] || '#0EA5E9';
  };

  const platformColor = getPlatformColor();
  const tipoAfectacion = recurrente.afectaCuentaPrincipal ? 'Sí afecta (principal)' : recurrente.afectaSubcuenta ? 'Afecta subcuenta' : 'No afecta';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-black/10 dark:border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex-1 text-center">
                <h2 className="text-xl font-bold text-content">{recurrente.plataforma?.nombre || 'Recurrente'}</h2>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                  recurrente.pausado ? 'bg-yellow-500/10 text-yellow-600' : 'bg-blue-500/10 text-blue-600'
                }`}>
                  {recurrente.pausado ? <Pause size={12} /> : <CheckCircle2 size={12} />}
                  {recurrente.pausado ? 'En pausa' : 'Activa'}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-content/5 rounded-xl transition-all">
                <X size={24} className="text-content" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tarjeta principal */}
              <div className="bg-gradient-to-br from-primary/10 to-orange-500/10 dark:from-primary/20 dark:to-orange-500/20 rounded-2xl p-6 border border-primary/20">
                <p className="text-sm font-semibold text-content/60 text-center mb-2">Monto programado</p>
                <div className="flex items-end justify-center gap-2">
                  <h3 className="text-4xl font-bold text-content">${recurrente.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h3>
                  <span className="text-lg text-content/60 mb-1">MXN</span>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platformColor }} />
                  <span className="text-sm text-content/60">Color de identificación</span>
                </div>

                {/* Barra de progreso */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} style={{ color: platformColor }} />
                    <span className="text-sm font-semibold" style={{ color: platformColor }}>
                      {diasRestantes === 0 ? 'Se ejecuta hoy' : `En ${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'}`}
                    </span>
                  </div>
                  <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progreso * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: platformColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => onEdit?.(recurrente)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-black/10 dark:border-white/10 hover:border-primary/30 transition-all"
                >
                  <Edit2 size={20} className="text-content" />
                  <span className="text-xs font-semibold text-content">Editar</span>
                </button>
                <button
                  onClick={() => onToggleEstado?.(recurrente)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-black/10 dark:border-white/10 hover:border-primary/30 transition-all"
                >
                  {recurrente.pausado ? <Play size={20} className="text-content" /> : <Pause size={20} className="text-content" />}
                  <span className="text-xs font-semibold text-content">{recurrente.pausado ? 'Reanudar' : 'Pausar'}</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all"
                >
                  <Trash2 size={20} className="text-red-600" />
                  <span className="text-xs font-semibold text-red-600">Eliminar</span>
                </button>
              </div>

              {/* Recordatorios */}
              <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlarmClock size={18} className="text-content/60" />
                  <h4 className="text-sm font-bold text-content">Recordatorios</h4>
                </div>
                {!recurrente.recordatorios || recurrente.recordatorios.length === 0 ? (
                  <p className="text-sm text-content/60">No hay recordatorios configurados</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {recurrente.recordatorios.map((d, i) => (
                      <span
                        key={`${d}-${i}`}
                        className="px-3 py-1 rounded-full text-xs font-semibold border"
                        style={{ borderColor: `${platformColor}40`, backgroundColor: `${platformColor}10`, color: platformColor }}
                      >
                        {d === 1 ? '1 día antes' : `${d} días antes`}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid de información */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-black/10 dark:border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-3">
                    <TrendingUp size={18} className="text-orange-600" />
                  </div>
                  <p className="text-xs font-semibold text-content/60 mb-1">Impacto en cuenta</p>
                  <p className="text-sm font-bold text-content">{tipoAfectacion}</p>
                  <p className="text-xs text-content/50 mt-1">
                    {recurrente.afectaCuentaPrincipal ? 'Modifica saldo principal' : recurrente.afectaSubcuenta ? 'Afecta subcuenta' : 'No impacta saldos'}
                  </p>
                </div>
                <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-black/10 dark:border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-3">
                    <FingerprintIcon size={18} className="text-orange-600" />
                  </div>
                  <p className="text-xs font-semibold text-content/60 mb-1">ID Recurrente</p>
                  <p className="text-sm font-bold text-content truncate">{recurrente.id || recurrente._id || recurrente.recurrenteId}</p>
                  <p className="text-xs text-content/50 mt-1">Identificador único</p>
                </div>
              </div>

              {/* Información detallada */}
              <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 border border-black/10 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <Repeat size={18} style={{ color: platformColor }} />
                  <span className="text-sm font-semibold text-content/60 w-32">Frecuencia</span>
                  <span className="text-sm font-bold text-content flex-1">{obtenerDescripcionFrecuencia(recurrente.frecuenciaTipo, recurrente.frecuenciaValor)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} style={{ color: platformColor }} />
                  <span className="text-sm font-semibold text-content/60 w-32">Próxima ejecución</span>
                  <span className="text-sm font-bold text-content flex-1">{formatearFechaLocal(proximaEjecucion)}</span>
                </div>
                {recurrente.plataforma?.categoria && (
                  <div className="flex items-center gap-3">
                    <Layers size={18} style={{ color: platformColor }} />
                    <span className="text-sm font-semibold text-content/60 w-32">Categoría</span>
                    <span className="text-sm font-bold text-content flex-1">{recurrente.plataforma.categoria}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal de confirmación de eliminación */}
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
                    <h3 className="text-lg font-bold text-content mb-2">Eliminar recurrente</h3>
                    <p className="text-sm text-content/60 mb-6">¿Estás seguro de que deseas eliminar este recurrente? Esta acción no se puede deshacer.</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-2 rounded-xl bg-content/5 hover:bg-content/10 text-content font-semibold transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          onDelete?.(recurrente.id || recurrente._id || recurrente.recurrenteId || '');
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
