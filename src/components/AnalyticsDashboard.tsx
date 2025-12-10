import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, BarChart3 } from 'lucide-react';
import { PieChart as RechartsP, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useAnalyticsDashboard } from '../hooks/useAnalytics';
import { CardSkeleton, ChartSkeleton } from './SkeletonLoader';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'];

export default function AnalyticsDashboard() {
  const { resumen, porConcepto, porSubcuenta, loading, error } = useAnalyticsDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-primary/5 px-2 sm:px-4 md:px-6 py-2 md:py-6 space-y-6">
        <div className="h-4 md:h-6 lg:h-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold mb-2">Error al cargar analíticas</p>
          <p>{error?.message || 'Ha ocurrido un error desconocido'}</p>
        </div>
      </div>
    );
  }

  const conceptoData = porConcepto.map(c => ({
    name: c.concepto.nombre,
    value: c.totalGasto + c.totalIngreso,
    color: c.concepto.color,
  }));

  const subcuentaData = porSubcuenta.map(s => ({
    nombre: s.subcuenta.nombre,
    ingresos: s.totalIngreso,
    gastos: s.totalGasto,
    saldo: s.saldoActual,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-primary/5 px-2 sm:px-4 md:px-6 py-2 md:py-6 space-y-6">
      {/* Espacio para el navbar */}
      <div className="h-4 md:h-6 lg:h-8" />

      {/* Resumen Financiero */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4">
          {/* ...tarjetas resumen... */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-4 md:p-6 min-w-0"
          >
            {/* ...existing code... */}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <TrendingUp className="text-green-500" size={24} />
              </div>
              <span className="text-xs font-medium text-content/60 uppercase">Ingresos</span>
            </div>
            <p className="text-3xl font-bold text-content mb-1">
              {resumen.totalIngresado.desglosePorMoneda[0]?.simbolo || '$'}
              {resumen.totalIngresado.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-content/60">{resumen.totalIngresado.moneda}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-4 md:p-6 min-w-0"
          >
            {/* ...existing code... */}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <TrendingDown className="text-red-500" size={24} />
              </div>
              <span className="text-xs font-medium text-content/60 uppercase">Gastos</span>
            </div>
            <p className="text-3xl font-bold text-content mb-1">
              {resumen.totalGastado.desglosePorMoneda[0]?.simbolo || '$'}
              {resumen.totalGastado.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-content/60">{resumen.totalGastado.moneda}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-4 md:p-6 min-w-0"
          >
            {/* ...existing code... */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${resumen.balance.esPositivo ? 'bg-blue-500/10' : 'bg-orange-500/10'}`}>
                <DollarSign className={resumen.balance.esPositivo ? 'text-blue-500' : 'text-orange-500'} size={24} />
              </div>
              <span className="text-xs font-medium text-content/60 uppercase">Balance</span>
            </div>
            <p className={`text-3xl font-bold mb-1 ${resumen.balance.esPositivo ? 'text-green-500' : 'text-red-500'}`}>
              {resumen.balance.esPositivo ? '+' : '-'}
              $
              {Math.abs(resumen.balance.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-content/60">{resumen.balance.moneda}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-4 md:p-6 min-w-0"
          >
            {/* ...existing code... */}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Activity className="text-purple-500" size={24} />
              </div>
              <span className="text-xs font-medium text-content/60 uppercase">Movimientos</span>
            </div>
            <p className="text-3xl font-bold text-content mb-1">{resumen.totalMovimientos}</p>
            <p className="text-sm text-content/60">Transacciones</p>
          </motion.div>
        </div>
      )}

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4">
        {/* Gráfica de Conceptos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-4 md:p-6 min-w-0 flex flex-col justify-between"
        >
          {/* ...existing code... */}
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="text-primary" size={24} />
            <h3 className="text-xl font-bold text-content">Distribución por Concepto</h3>
          </div>
          {conceptoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={200}>
              <RechartsP>
                <Pie
                  data={conceptoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conceptoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsP>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-content/60 py-8">No hay datos de conceptos</p>
          )}
        </motion.div>

        {/* Gráfica de Subcuentas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-4 md:p-6 min-w-0 flex flex-col justify-between"
        >
          {/* ...existing code... */}
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-primary" size={24} />
            <h3 className="text-xl font-bold text-content">Análisis por Subcuenta</h3>
          </div>
          {subcuentaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={200}>
              <BarChart data={subcuentaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ingresos" fill="#10B981" name="Ingresos" />
                <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-content/60 py-8">No hay datos de subcuentas</p>
          )}
        </motion.div>
      </div>

      {/* Tabla de Detalles de Conceptos */}
      {porConcepto.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-2 md:p-6 min-w-0 overflow-x-auto"
        >
          <h3 className="text-xl font-bold text-content mb-4 md:mb-6">Detalles por Concepto</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10">
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-content/60">Concepto</th>
                  <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-content/60">Ingresos</th>
                  <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-content/60">Gastos</th>
                  <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-content/60">Movimientos</th>
                  <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-content/60">Promedio</th>
                  <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-content/60">Participación</th>
                </tr>
              </thead>
              <tbody>
                {porConcepto.map((c, idx) => (
                  <tr key={idx} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.concepto.color }}></div>
                        <span className="font-medium text-content">{c.concepto.nombre}</span>
                      </div>
                    </td>
                    <td className="text-right py-2 md:py-3 px-2 md:px-4 text-green-600">${c.totalIngreso.toLocaleString()}</td>
                    <td className="text-right py-2 md:py-3 px-2 md:px-4 text-red-600">${c.totalGasto.toLocaleString()}</td>
                    <td className="text-right py-2 md:py-3 px-2 md:px-4 text-content">{c.cantidadMovimientos}</td>
                    <td className="text-right py-2 md:py-3 px-2 md:px-4 text-content">${c.montoPromedio.toLocaleString()}</td>
                    <td className="text-right py-2 md:py-3 px-2 md:px-4 text-content">{c.participacionPorcentual.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      {/* Espacio inferior para evitar solapamiento con el borde de la pantalla */}
      <div className="h-4 md:h-8" />
    </div>
  );
}
