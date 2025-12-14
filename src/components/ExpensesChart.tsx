import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Repeat } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type PeriodoFiltro = 'dia' | 'semana' | 'mes';
type TipoTransaccionFiltro = 'ingreso' | 'egreso' | 'ambos';

interface ExpensesChartProps {
  refreshKey?: number;
}

interface AnalyticsFilters {
  rangoTiempo?: 'dia' | 'semana' | 'mes' | '3meses' | '6meses' | 'año' | 'personalizado';
  tipoTransaccion?: 'ingreso' | 'egreso' | 'ambos';
}

interface AnalisisTemporal {
  periodoAnalisis: string;
  datos: Array<{
    fecha: string;
    ingresos: number;
    gastos: number;
    balance: number;
    cantidadMovimientos: number;
  }>;
  tendencias: {
    ingresosTendencia: string;
    gastosTendencia: string;
    balanceTendencia: string;
  };
  promedios: {
    ingresoPromedio: number;
    gastoPromedio: number;
    balancePromedio: number;
  };
}

export default function ExpensesChart({ refreshKey = 0 }: ExpensesChartProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<PeriodoFiltro>('mes');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoTransaccionFiltro>('ambos');

  const { data: analisisData, isLoading } = useQuery<AnalisisTemporal>({
    queryKey: ['analisis-temporal', periodoSeleccionado, tipoSeleccionado, refreshKey],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://litfinance-api-production.up.railway.app';
      
      const filters: AnalyticsFilters = {
        rangoTiempo: periodoSeleccionado,
        tipoTransaccion: tipoSeleccionado,
      };

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${baseUrl}/analytics/analisis-temporal?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Error al cargar análisis');
      return await response.json();
    },
    staleTime: 30000,
    enabled: !!refreshKey || refreshKey === 0,
  });

  const renderChart = () => {
    if (!analisisData || !analisisData.datos || analisisData.datos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[240px] text-content/40">
          <TrendingUp size={48} className="mb-2" />
          <p className="text-sm font-medium">No hay datos para mostrar</p>
        </div>
      );
    }

    // Calcular el máximo con padding para mejor visualización
    const maxValue = Math.max(
      ...analisisData.datos.map((d) => Math.max(d.ingresos, d.gastos)),
      100
    ) * 1.1; // Añade 10% de padding arriba

    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;
    const chartWidth = 800;
    const chartHeight = 240;
    const graphWidth = chartWidth - paddingLeft - paddingRight;
    const graphHeight = chartHeight - paddingTop - paddingBottom;

    // Calcular puntos para las líneas con mejor espaciado
    const puntos = analisisData.datos.map((dato, index) => {
      const x = paddingLeft + (index / Math.max(analisisData.datos.length - 1, 1)) * graphWidth;
      const yIngresos = paddingTop + graphHeight - ((dato.ingresos / maxValue) * graphHeight);
      const yGastos = paddingTop + graphHeight - ((dato.gastos / maxValue) * graphHeight);
      return { x, yIngresos, yGastos, dato, index };
    });

    // Crear path SVG suave con Catmull-Rom
    const createSmoothPath = (points: { x: number; y: number }[]) => {
      if (points.length === 0) return '';
      if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
      if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

      let path = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      
      return path;
    };

    const ingresosPoints = puntos.map(p => ({ x: p.x, y: p.yIngresos }));
    const gastosPoints = puntos.map(p => ({ x: p.x, y: p.yGastos }));
    const ingresosPath = createSmoothPath(ingresosPoints);
    const gastosPath = createSmoothPath(gastosPoints);

    // Calcular líneas de grid
    const gridLines = 5;
    const gridValues = Array.from({ length: gridLines }, (_, i) => {
      const value = (maxValue / (gridLines - 1)) * i;
      const y = paddingTop + graphHeight - ((value / maxValue) * graphHeight);
      return { value, y };
    });

    return (
      <div className="relative">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-[240px]"
          style={{ maxWidth: '100%' }}
        >
          {/* Grid lines horizontales */}
          {gridValues.map((grid, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={grid.y}
                x2={chartWidth - paddingRight}
                y2={grid.y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="text-content/10"
              />
              <text
                x={paddingLeft - 8}
                y={grid.y + 4}
                textAnchor="end"
                fontSize="10"
                className="fill-content/50"
              >
                ${grid.value.toFixed(0)}
              </text>
            </g>
          ))}

          {/* Área de fondo para Ingresos */}
          {(tipoSeleccionado === 'ingreso' || tipoSeleccionado === 'ambos') && ingresosPath && (
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 0.6 }}
              d={`${ingresosPath} L ${chartWidth - paddingRight} ${paddingTop + graphHeight} L ${paddingLeft} ${paddingTop + graphHeight} Z`}
              fill="#4CAF50"
            />
          )}

          {/* Área de fondo para Gastos */}
          {(tipoSeleccionado === 'egreso' || tipoSeleccionado === 'ambos') && gastosPath && (
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 0.6 }}
              d={`${gastosPath} L ${chartWidth - paddingRight} ${paddingTop + graphHeight} L ${paddingLeft} ${paddingTop + graphHeight} Z`}
              fill="#F44336"
            />
          )}

          {/* Línea de Ingresos */}
          {(tipoSeleccionado === 'ingreso' || tipoSeleccionado === 'ambos') && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              d={ingresosPath}
              fill="none"
              stroke="#4CAF50"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Línea de Gastos */}
          {(tipoSeleccionado === 'egreso' || tipoSeleccionado === 'ambos') && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              d={gastosPath}
              fill="none"
              stroke="#F44336"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Puntos en la línea de Ingresos */}
          {(tipoSeleccionado === 'ingreso' || tipoSeleccionado === 'ambos') && puntos.map((punto) => (
            <g key={`ingreso-${punto.index}`}>
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: punto.index * 0.08, duration: 0.3 }}
                cx={punto.x}
                cy={punto.yIngresos}
                r="5"
                fill="white"
                stroke="#4CAF50"
                strokeWidth="2.5"
                className="cursor-pointer"
              />
              <title>Ingresos: ${punto.dato.ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</title>
            </g>
          ))}

          {/* Puntos en la línea de Gastos */}
          {(tipoSeleccionado === 'egreso' || tipoSeleccionado === 'ambos') && puntos.map((punto) => (
            <g key={`gasto-${punto.index}`}>
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: punto.index * 0.08, duration: 0.3 }}
                cx={punto.x}
                cy={punto.yGastos}
                r="5"
                fill="white"
                stroke="#F44336"
                strokeWidth="2.5"
                className="cursor-pointer"
              />
              <title>Egresos: ${punto.dato.gastos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</title>
            </g>
          ))}

          {/* Labels de fechas */}
          {puntos.map((punto) => {
            const date = new Date(punto.dato.fecha);
            const label = `${date.getDate()}/${date.getMonth() + 1}`;
            return (
              <text
                key={`label-${punto.index}`}
                x={punto.x}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize="11"
                className="fill-content/60"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm rounded-2xl p-6 border border-black/10 dark:border-white/10 shadow-lg mb-6"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-content/10 rounded-lg w-1/3 mb-4" />
          <div className="h-[200px] bg-content/5 rounded-xl" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm rounded-2xl p-6 border border-black/10 dark:border-white/10 shadow-lg mb-6"
    >
      {/* Header con filtros */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-content">Análisis de Movimientos</h3>
        
        <div className="flex gap-2">
          {/* Filtro de Período */}
          <div className="flex gap-1">
            {(['dia', 'semana', 'mes'] as PeriodoFiltro[]).map((periodo) => (
              <motion.button
                key={periodo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPeriodoSeleccionado(periodo)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                  periodoSeleccionado === periodo
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white/50 dark:bg-neutral-800/50 text-content/60 hover:bg-content/10'
                }`}
              >
                {periodo === 'dia' ? 'D' : periodo === 'semana' ? 'S' : 'M'}
              </motion.button>
            ))}
          </div>

          {/* Filtro de Tipo */}
          <div className="flex gap-1">
            {([
              { value: 'ingreso', icon: TrendingUp },
              { value: 'egreso', icon: TrendingDown },
              { value: 'ambos', icon: Repeat },
            ] as const).map(({ value, icon: Icon }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTipoSeleccionado(value)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  tipoSeleccionado === value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white/50 dark:bg-neutral-800/50 text-content/60 hover:bg-content/10'
                }`}
              >
                <Icon size={14} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfica */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${periodoSeleccionado}-${tipoSeleccionado}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {renderChart()}
        </motion.div>
      </AnimatePresence>

      {/* Leyenda */}
      {tipoSeleccionado === 'ambos' && analisisData && analisisData.datos && analisisData.datos.length > 0 && (
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-green-400" />
            <span className="text-xs font-medium text-content/70">Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-red-400" />
            <span className="text-xs font-medium text-content/70">Egresos</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
