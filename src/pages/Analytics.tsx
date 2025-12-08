import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Calendar, DollarSign } from 'lucide-react';
import { obtenerResumenFinanciero, obtenerEstadisticasPorConcepto, obtenerEstadisticasPorSubcuenta } from '../services/analyticsService';
import type { ResumenFinanciero, EstadisticasPorConcepto, EstadisticasPorSubcuenta, AnalyticsFilters } from '../types/analytics';

export default function Analytics() {
  const [resumen, setResumen] = useState<ResumenFinanciero | null>(null);
  const [estadisticasConcepto, setEstadisticasConcepto] = useState<EstadisticasPorConcepto[]>([]);
  const [estadisticasSubcuenta, setEstadisticasSubcuenta] = useState<EstadisticasPorSubcuenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangoFechas, setRangoFechas] = useState({
    fechaInicio: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0]
  });

  const cargarAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      const filtros: AnalyticsFilters = {
        fechaInicio: rangoFechas.fechaInicio,
        fechaFin: rangoFechas.fechaFin
      };

      const [resumenData, conceptoData, subcuentaData] = await Promise.all([
        obtenerResumenFinanciero(filtros),
        obtenerEstadisticasPorConcepto(filtros),
        obtenerEstadisticasPorSubcuenta(filtros)
      ]);

      setResumen(resumenData);
      setEstadisticasConcepto(conceptoData);
      setEstadisticasSubcuenta(subcuentaData);
    } catch (error) {
      console.error('Error cargando analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [rangoFechas]);

  useEffect(() => {
    cargarAnalytics();
  }, [cargarAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-content/60">Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-content mb-2">Analíticas Financieras</h1>
          <p className="text-content/60">Visualiza tus patrones de ingresos y gastos</p>
        </motion.div>

        {/* Filtros de Fecha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <Calendar size={20} className="text-primary" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-content mb-2">Fecha Inicio</label>
                <input
                  type="date"
                  value={rangoFechas.fechaInicio}
                  onChange={(e) => setRangoFechas(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-content mb-2">Fecha Fin</label>
                <input
                  type="date"
                  value={rangoFechas.fechaFin}
                  onChange={(e) => setRangoFechas(prev => ({ ...prev, fechaFin: e.target.value }))}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resumen General */}
        {resumen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          >
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 dark:from-green-500/10 dark:to-green-600/10 rounded-2xl border border-green-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp size={32} className="text-green-500" />
                <div className="text-right">
                  <p className="text-sm text-content/60">Total Ingresos</p>
                  <p className="text-2xl font-bold text-content">${resumen.totalIngresado.monto.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 dark:from-red-500/10 dark:to-red-600/10 rounded-2xl border border-red-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingDown size={32} className="text-red-500" />
                <div className="text-right">
                  <p className="text-sm text-content/60">Total Egresos</p>
                  <p className="text-2xl font-bold text-content">${resumen.totalGastado.monto.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-500/10 dark:to-blue-600/10 rounded-2xl border border-blue-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign size={32} className="text-blue-500" />
                <div className="text-right">
                  <p className="text-sm text-content/60">Balance Neto</p>
                  <p className={`text-2xl font-bold ${resumen.balance.esPositivo ? 'text-green-500' : 'text-red-500'}`}>
                    ${resumen.balance.monto.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Estadísticas por Concepto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={24} className="text-primary" />
            <h2 className="text-2xl font-bold text-content">Gastos por Concepto</h2>
          </div>
          <div className="space-y-4">
            {estadisticasConcepto.length === 0 ? (
              <p className="text-center text-content/60 py-8">No hay datos de conceptos en este período</p>
            ) : (
              estadisticasConcepto.map((concepto, index) => {
                const maxTotal = Math.max(...estadisticasConcepto.map(c => c.totalGasto));
                const percentage = (concepto.totalGasto / maxTotal) * 100;

                return (
                  <motion.div
                    key={concepto.concepto.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="p-4 rounded-xl bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-content">{concepto.concepto.nombre}</span>
                      <span className="text-lg font-bold text-content">${concepto.totalGasto.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-content/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.5 + index * 0.05, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        />
                      </div>
                      <span className="text-sm text-content/60 w-16 text-right">{concepto.cantidadMovimientos} tx</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Estadísticas por Subcuenta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <PieChart size={24} className="text-primary" />
            <h2 className="text-2xl font-bold text-content">Distribución por Subcuenta</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estadisticasSubcuenta.length === 0 ? (
              <p className="col-span-full text-center text-content/60 py-8">No hay datos de subcuentas en este período</p>
            ) : (
              estadisticasSubcuenta.map((subcuenta, index) => {
                const colorMap: Record<string, string> = {
                  'Verde': 'from-green-500 to-green-600',
                  'Azul': 'from-blue-500 to-blue-600',
                  'Naranja': 'from-orange-500 to-orange-600',
                  'Rojo': 'from-red-500 to-red-600',
                  'Morado': 'from-purple-500 to-purple-600',
                  'Rosa': 'from-pink-500 to-pink-600',
                  'Cyan': 'from-cyan-500 to-cyan-600',
                  'Amarillo': 'from-yellow-500 to-yellow-600'
                };

                const gradientClass = subcuenta.subcuenta.color ? colorMap[subcuenta.subcuenta.color] || 'from-gray-500 to-gray-600' : 'from-gray-500 to-gray-600';

                return (
                  <motion.div
                    key={subcuenta.subcuenta.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className={`p-6 rounded-xl bg-gradient-to-br ${gradientClass} text-white shadow-lg`}
                  >
                    <h3 className="font-bold text-lg mb-2">{subcuenta.subcuenta.nombre}</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-90">Ingresos:</span>
                        <span className="font-semibold">${subcuenta.totalIngreso.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-90">Egresos:</span>
                        <span className="font-semibold">${subcuenta.totalGasto.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-white/30 pt-2 mt-2">
                        <span className="opacity-90">Balance:</span>
                        <span className="font-bold">${subcuenta.saldoActual.toFixed(2)}</span>
                      </div>
                      <div className="text-xs opacity-75 text-center mt-2">
                        {subcuenta.cantidadMovimientos} transacciones
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
