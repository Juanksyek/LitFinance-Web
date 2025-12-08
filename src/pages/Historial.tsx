import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, TrendingDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { listarTransacciones } from '../services/transaccionService';
import type { Transaccion } from '../types/transaccion';

export default function Historial() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    descripcion: '',
    rango: 'mes' as 'mes' | 'anio' | 'hoy' | 'semana',
    tipo: '' as '' | 'ingreso' | 'egreso'
  });
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    totalResultados: 0
  });

  const cargarHistorial = useCallback(async () => {
    try {
      setLoading(true);

      const response = await listarTransacciones({ rango: filtros.rango });
      
      setTransacciones(response.transacciones || []);
      // La paginación no está implementada en el servicio actual, asumimos todo en una página
      setPaginacion(prev => ({
        ...prev,
        totalPaginas: 1,
        totalResultados: (response.transacciones || []).length
      }));
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  }, [filtros.rango]);

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial, paginacion.paginaActual]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginacion(prev => ({ ...prev, paginaActual: 1 }));
    cargarHistorial();
  };

  const transaccionesFiltradas = filtros.tipo 
    ? transacciones.filter(t => t.tipo === filtros.tipo)
    : transacciones;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-content mb-2">Historial de Transacciones</h1>
          <p className="text-content/60">Revisa y busca tus movimientos financieros</p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-primary" />
            <h2 className="text-xl font-bold text-content">Filtros de Búsqueda</h2>
          </div>

          <form onSubmit={handleBuscar} className="space-y-4">
            {/* Búsqueda por descripción */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40" />
              <input
                type="text"
                placeholder="Buscar por motivo o descripción..."
                value={filtros.descripcion}
                onChange={(e) => setFiltros(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rango de tiempo */}
              <div>
                <label className="block text-sm font-medium text-content mb-2">Rango de Tiempo</label>
                <select
                  value={filtros.rango}
                  onChange={(e) => setFiltros(prev => ({ ...prev, rango: e.target.value as 'mes' | 'anio' | 'hoy' | 'semana' }))}
                  className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content"
                >
                  <option value="hoy">Hoy</option>
                  <option value="semana">Última semana</option>
                  <option value="mes">Último mes</option>
                  <option value="anio">Último año</option>
                </select>
              </div>

              {/* Tipo de transacción */}
              <div>
                <label className="block text-sm font-medium text-content mb-2">Tipo de Transacción</label>
                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value as '' | 'ingreso' | 'egreso' }))}
                  className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content"
                >
                  <option value="">Todas</option>
                  <option value="ingreso">Solo Ingresos</option>
                  <option value="egreso">Solo Egresos</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Aplicar Filtros
            </button>
          </form>
        </motion.div>

        {/* Resultados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-content">Resultados ({paginacion.totalResultados})</h2>
            <div className="flex items-center gap-2 text-sm text-content/60">
              <Calendar size={16} />
              <span>Página {paginacion.paginaActual} de {paginacion.totalPaginas}</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-content/60">Cargando transacciones...</p>
            </div>
          ) : transaccionesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-content/60">No se encontraron transacciones con estos filtros</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transaccionesFiltradas.map((transaccion, index) => (
                <motion.div
                  key={transaccion._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                    transaccion.tipo === 'ingreso'
                      ? 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10'
                      : 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        transaccion.tipo === 'ingreso'
                          ? 'bg-green-500/20'
                          : 'bg-red-500/20'
                      }`}>
                        {transaccion.tipo === 'ingreso' ? (
                          <TrendingUp size={24} className="text-green-500" />
                        ) : (
                          <TrendingDown size={24} className="text-red-500" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-content">{transaccion.concepto}</h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            transaccion.tipo === 'ingreso'
                              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                              : 'bg-red-500/20 text-red-600 dark:text-red-400'
                          }`}>
                            {transaccion.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                          </span>
                        </div>

                        {transaccion.motivo && (
                          <p className="text-sm text-content/60 mb-2">{transaccion.motivo}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-content/60">
                          {transaccion.fecha && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{new Date(transaccion.fecha).toLocaleDateString('es-ES')}</span>
                            </div>
                          )}
                          {transaccion.subCuentaId && (
                            <span className="px-2 py-1 bg-content/10 rounded-lg text-xs">
                              Subcuenta: {transaccion.subCuentaId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        transaccion.tipo === 'ingreso' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaccion.tipo === 'ingreso' ? '+' : '-'}${transaccion.monto.toFixed(2)}
                      </p>
                      {transaccion.moneda && transaccion.moneda !== 'MXN' && (
                        <p className="text-xs text-content/60 mt-1">{transaccion.moneda}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {!loading && transaccionesFiltradas.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-black/10 dark:border-white/10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={paginacion.paginaActual === 1}
                onClick={() => setPaginacion(prev => ({ ...prev, paginaActual: prev.paginaActual - 1 }))}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-content font-medium hover:border-primary transition-all"
              >
                <ChevronLeft size={18} />
                Anterior
              </motion.button>

              <span className="text-sm font-medium text-content px-4">
                Página {paginacion.paginaActual} de {paginacion.totalPaginas}
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={paginacion.paginaActual >= paginacion.totalPaginas}
                onClick={() => setPaginacion(prev => ({ ...prev, paginaActual: prev.paginaActual + 1 }))}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-content font-medium hover:border-primary transition-all"
              >
                Siguiente
                <ChevronRight size={18} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
