import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  RefreshCw, 
  BarChart3,
  Settings,
  Search,
  ChevronDown,
  Calendar,
  CheckCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import CrearIngresoModal from '../components/CrearIngresoModal';
import CrearEgresoModal from '../components/CrearEgresoModal';
import CrearSubcuentaModal from '../components/CrearSubcuentaModal';
import CrearRecurrenteModal from '../components/CrearRecurrenteModal';
import SubcuentasCard from '../components/SubcuentasCard';
import { CardSkeleton, TableSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../hooks/useAuth';
import { useCuentaPrincipal } from '../hooks/useCuentaPrincipal';
import { useCuentaHistorial } from '../hooks/useCuentaHistorial';
import { listarRecurrentes } from '../services';
import { eliminarRecurrente } from '../services/recurrenteService';
import type {
  Subcuenta,
  Recurrente,
} from '../types';

export default function Dashboard() {
  const { user, cuentaPrincipal } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estados de búsqueda y paginación (antes de los hooks)
  const [busquedaMovimientos, setBusquedaMovimientos] = useState('');
  const [paginaMovimientos, setPaginaMovimientos] = useState(1);
  const [periodo, setPeriodo] = useState('mes');

  // Usar hooks optimizados con cache
  const { cuenta: cuentaFromHook, loading: loadingCuenta, refetch: refetchCuenta } = useCuentaPrincipal();
  // Usar historial de cuenta principal
  const cuentaIdRaw = cuentaFromHook?.userId || cuentaPrincipal?.userId || cuentaFromHook?._id || cuentaFromHook?.id || cuentaPrincipal?._id || cuentaPrincipal?.id;
  const cuentaId = cuentaIdRaw;
  const { data: movimientos = [], isLoading: loadingMovimientos, refetch: refetchMovimientos, error: errorMovimientos } = useCuentaHistorial(
    cuentaId,
    paginaMovimientos,
    10,
    busquedaMovimientos
  );

  // Query para recurrentes con cache
  const { data: recurrentesData, isLoading: loadingRecurrentes, refetch: refetchRecurrentes } = useQuery({
    queryKey: ['recurrentes', user?.id],
    queryFn: () => listarRecurrentes(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 1000 * 30,
    select: (data) => data.items || data.recurrentes || [],
  });

  const recurrentes = recurrentesData || [];
  const cuenta = cuentaFromHook || cuentaPrincipal;
  const loading = loadingCuenta || loadingMovimientos || loadingRecurrentes;

  // Mutation para eliminar recurrente
  const eliminarMutation = useMutation({
    mutationFn: eliminarRecurrente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurrentes'] });
      refetchRecurrentes();
    },
  });

  // Estados de modales
  const [modalIngresoOpen, setModalIngresoOpen] = useState(false);
  const [modalEgresoOpen, setModalEgresoOpen] = useState(false);
  const [modalSubcuentaOpen, setModalSubcuentaOpen] = useState(false);
  const [modalRecurrenteOpen, setModalRecurrenteOpen] = useState(false);

  // Estados de filtros
  const [busquedaRecurrente, setBusquedaRecurrente] = useState('');
  const [filtroMovimientos, setFiltroMovimientos] = useState<'todos' | 'ingreso' | 'egreso'>('todos');

  // Función para refrescar todos los datos
  const refrescarDatos = () => {
    refetchCuenta();
    refetchMovimientos();
    refetchRecurrentes();
  };

  // Funciones de edición y eliminación
  const handleEditarSubcuenta = (subcuenta: Subcuenta) => {
    console.log('Editar subcuenta:', subcuenta);
    setModalSubcuentaOpen(true);
  };

  const handleEditarRecurrente = (recurrente: Recurrente) => {
    console.log('Editar recurrente:', recurrente);
    setModalRecurrenteOpen(true);
  };

  const handleEliminarRecurrente = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este recurrente?')) return;
    
    try {
      await eliminarMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error al eliminar recurrente:', error);
      alert('Error al eliminar el recurrente');
    }
  };

  // Calcular totales de ingresos y egresos desde el endpoint de transacciones con rango
  const { data: transaccionesPeriodo = [] } = useQuery({
    queryKey: ['transacciones_periodo', user?.id, periodo],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'https://litfinance-api-production.up.railway.app'}/transacciones?rango=${periodo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!user?.id,
    staleTime: 1000 * 30,
  });

  const calcularTotales = () => {
    const arr = Array.isArray(transaccionesPeriodo) ? transaccionesPeriodo : [];
    const ingresos = arr
      .filter((t: any) => t.tipo === 'ingreso')
      .reduce((sum: number, t: any) => sum + t.monto, 0);

    const egresos = arr
      .filter((t: any) => t.tipo === 'egreso')
      .reduce((sum: number, t: any) => sum + Math.abs(t.monto), 0);

    return { ingresos, egresos };
  };

  // UI de loading con skeleton
  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <div className="min-h-screen bg-bg pt-20 pb-12 px-4">
          <div className="container-app max-w-7xl mx-auto">
            <div className="mb-6">
              <CardSkeleton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TableSkeleton rows={5} />
              </div>
              <CardSkeleton />
            </div>
          </div>
        </div>
      </>
    );
  }

  const { ingresos, egresos } = calcularTotales();

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-bg pt-20 pb-12 px-4">
        <div className="container-app max-w-7xl mx-auto">
          {/* Tarjeta de Saldo Total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-8 mb-6 shadow-2xl shadow-primary/20 overflow-hidden"
          >
            {/* Imagen de fondo decorativa */}
            <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
              <img 
                src="/images/LitFinance.png" 
                alt="" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm mb-2">Saldo total</p>
                <h2 className="text-5xl font-bold text-white">
                  {cuenta?.simbolo || '$'}{(cuenta?.cantidad || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
              >
                <Settings size={20} className="text-white" />
              </motion.button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-500/20">
                  <ArrowUpCircle size={20} className="text-green-300" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Ingreso</p>
                  <p className="text-white font-semibold">
                    {cuenta?.simbolo || '$'}{ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-red-500/20">
                  <ArrowDownCircle size={20} className="text-red-300" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Egreso</p>
                  <p className="text-white font-semibold">
                    {cuenta?.simbolo || '$'}{egresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Selector de período */}
            <div className="mt-6 relative">
              <motion.button
                onClick={() => {
                  const periodos = ['dia', 'semana', 'mes', '3meses', '6meses', 'año'];
                  const currentIndex = periodos.indexOf(periodo);
                  const nextPeriodo = periodos[(currentIndex + 1) % periodos.length];
                  setPeriodo(nextPeriodo);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white"
              >
                <Calendar size={16} />
                <span className="text-sm font-medium">
                  {periodo === 'dia' ? 'Día' : 
                   periodo === 'semana' ? 'Semana' :
                   periodo === 'mes' ? 'Mes' :
                   periodo === '3meses' ? '3 Meses' :
                   periodo === '6meses' ? '6 Meses' : 'Año'}
                </span>
                <ChevronDown size={16} />
              </motion.button>
            </div>
            </div>
          </motion.div>

          {/* Acciones rápidas - estilo app */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-5 gap-3 mb-6 justify-items-center"
          >
            {[
              { icon: TrendingUp, label: 'Ingreso', onClick: () => setModalIngresoOpen(true) },
              { icon: TrendingDown, label: 'Egreso', onClick: () => setModalEgresoOpen(true) },
              { icon: Plus, label: 'Subcuenta', onClick: () => setModalSubcuentaOpen(true) },
              { icon: RefreshCw, label: 'Recurrente', onClick: () => setModalRecurrenteOpen(true) },
              { icon: BarChart3, label: 'Analíticas', onClick: () => navigate('/analytics') }
            ].map((action, index) => (
              <motion.button
                key={action.label}
                onClick={action.onClick}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex flex-col items-center justify-center gap-2 px-3 py-3 bg-white/80 dark:bg-[#2a2d35] rounded-2xl border border-gray-200 dark:border-[#3a3d45] shadow-sm dark:shadow-none transition-all min-h-[70px] w-full max-w-[90px] hover:border-[#ff9100] hover:shadow-lg hover:shadow-[#ff9100]/30 hover:-translate-y-1 hover:bg-white dark:hover:bg-[#23242a]"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg">
                  <action.icon size={34} className="text-[#ff9100]" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-[#c0c0c0] leading-tight text-center">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Grid de Recurrentes y Subcuentas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recurrentes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-content">Recurrentes</h3>
                <motion.button
                  onClick={() => setModalRecurrenteOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-primary/10 transition-all"
                >
                  <Plus size={20} className="text-primary" />
                </motion.button>
              </div>
              <div className="relative mb-4">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40" />
                <input
                  type="text"
                  value={busquedaRecurrente}
                  onChange={(e) => setBusquedaRecurrente(e.target.value)}
                  placeholder="Buscar recurrente..."
                  className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
                />
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-content/60">
                    <p>Cargando recurrentes...</p>
                  </div>
                ) : recurrentes.filter(r => 
                    r.nombre.toLowerCase().includes(busquedaRecurrente.toLowerCase()) ||
                    r.plataforma?.nombre?.toLowerCase().includes(busquedaRecurrente.toLowerCase())
                  ).length === 0 ? (
                  <div className="text-center py-8 text-content/60">
                    <p>No hay recurrentes registrados</p>
                  </div>
                ) : (
                  recurrentes.filter(r => 
                    r.nombre.toLowerCase().includes(busquedaRecurrente.toLowerCase()) ||
                    r.plataforma?.nombre?.toLowerCase().includes(busquedaRecurrente.toLowerCase())
                  ).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl border-2 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xl">{item.plataforma?.nombre?.charAt(0) || '💰'}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-content">{item.nombre}</h4>
                          <p className="text-xs text-content/60">{item.plataforma?.nombre || 'Sin plataforma'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditarRecurrente(item);
                          }}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-all"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminarRecurrente(item.id || item._id || '');
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-content">
                        {cuenta?.simbolo || '$'}{item.monto.toFixed(2)}
                      </p>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium">
                        Activa
                      </span>
                    </div>
                  </motion.div>
                ))
                )}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                <button className="text-sm text-content/50">Anterior</button>
                <span className="text-sm font-medium text-content">Página 1</span>
                <button className="text-sm text-content/50">Siguiente</button>
              </div>
            </motion.div>

            {/* Subcuentas - Componente Modular */}
            <SubcuentasCard 
              onOpenModal={() => setModalSubcuentaOpen(true)}
              onEditSubcuenta={handleEditarSubcuenta}
              onSubcuentaChange={refrescarDatos}
            />
          </div>

          {/* Movimientos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-content">Movimientos Recientes</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFiltroMovimientos('todos')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filtroMovimientos === 'todos' 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-content/5 text-content/60'
                  }`}
                >
                  Todos
                </button>
                <button 
                  onClick={() => setFiltroMovimientos('ingreso')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filtroMovimientos === 'ingreso' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'hover:bg-content/5 text-content/60'
                  }`}
                >
                  Ingresos
                </button>
                <button 
                  onClick={() => setFiltroMovimientos('egreso')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filtroMovimientos === 'egreso' 
                      ? 'bg-red-500/10 text-red-500' 
                      : 'hover:bg-content/5 text-content/60'
                  }`}
                >
                  Egresos
                </button>
              </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40" />
              <input
                type="text"
                value={busquedaMovimientos}
                onChange={(e) => {
                  setBusquedaMovimientos(e.target.value);
                  setPaginaMovimientos(1);
                }}
                placeholder="Buscar por descripción..."
                className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
              />
            </div>

            <div className="space-y-3">
              {/* Lista de movimientos desde historial de cuenta */}
              {(() => {
                if (loadingMovimientos) {
                  return (
                    <div className="text-center py-8 text-content/60">
                      <p>Cargando movimientos...</p>
                    </div>
                  );
                }
                if (errorMovimientos) {
                  return (
                    <div className="text-center py-8 text-red-500">
                      <p>Error al cargar movimientos</p>
                      <button 
                        onClick={() => refetchMovimientos()}
                        className="mt-2 text-sm underline"
                      >
                        Reintentar
                      </button>
                    </div>
                  );
                }
                let lista = Array.isArray(movimientos) ? movimientos : [];
                if (filtroMovimientos !== 'todos') {
                  lista = lista.filter((t: any) => t.tipo === filtroMovimientos);
                }
                if (lista.length === 0) {
                  return (
                    <div className="text-center py-8 text-content/60">
                      <p>No hay movimientos registrados</p>
                    </div>
                  );
                }
                return lista.slice(0, 10).map((mov: any, index: number) => {
                  let icon = null;
                  let color = '';
                  let bg = '';
                  let tipoLabel = '';
                  let montoLabel = '';
                  if (mov.tipo === 'ingreso') {
                    icon = <TrendingUp size={20} className="text-green-500" />;
                    color = 'text-green-500';
                    bg = 'bg-green-500/10';
                    tipoLabel = 'Ingreso';
                    montoLabel = '+';
                  } else if (mov.tipo === 'egreso') {
                    icon = <TrendingDown size={20} className="text-red-500" />;
                    color = 'text-red-500';
                    bg = 'bg-red-500/10';
                    tipoLabel = 'Egreso';
                    montoLabel = '-';
                  } else {
                    icon = <RefreshCw size={20} className="text-yellow-500" />;
                    color = 'text-yellow-500';
                    bg = 'bg-yellow-500/10';
                    tipoLabel = 'Otro';
                    montoLabel = '';
                  }
                  return (
                    <motion.div
                      key={mov.id || mov._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-neutral-900/30 border border-black/10 dark:border-white/10 hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${bg}`}>
                          {icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-content">{mov.descripcion || mov.concepto || mov.motivo || 'Movimiento'}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-content/60">
                              {mov.fecha ? new Date(mov.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-content/10 text-content/70">
                              {tipoLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${color}`}>
                        {montoLabel}{cuenta?.simbolo || '$'}{Math.abs(mov.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </div>
                    </motion.div>
                  );
                });
              })()}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/10 dark:border-white/10">
              <button
                disabled={paginaMovimientos === 1}
                onClick={() => setPaginaMovimientos(prev => Math.max(prev - 1, 1))}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-neutral-900/30 border border-black/10 dark:border-white/10 hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-content"
              >
                <ChevronDown size={16} className="rotate-90" />
                <span className="text-sm font-medium">Anterior</span>
              </button>
              
              <span className="text-sm font-medium text-content">Página {paginaMovimientos}</span>
              
              <button
                disabled={movimientos.length < 10}
                onClick={() => setPaginaMovimientos(prev => prev + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-neutral-900/30 border border-black/10 dark:border-white/10 hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-content"
              >
                <span className="text-sm font-medium">Siguiente</span>
                <ChevronDown size={16} className="-rotate-90" />
              </button>
            </div>

            <motion.button
              onClick={() => navigate('/historial')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary font-medium hover:bg-primary/5 transition-all"
            >
              Ver todos los movimientos
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Modales */}
      {cuenta && cuenta._id && (
        <>
          <CrearIngresoModal 
            isOpen={modalIngresoOpen}
            onClose={() => setModalIngresoOpen(false)}
            onSuccess={() => {
              refrescarDatos();
              setModalIngresoOpen(false);
            }}
            monedaPrincipal={cuenta.nombre}
            simbolo="$"
          />

          <CrearEgresoModal 
            isOpen={modalEgresoOpen}
            onClose={() => setModalEgresoOpen(false)}
            onSuccess={() => {
              refrescarDatos();
              setModalEgresoOpen(false);
            }}
            monedaPrincipal={cuenta.nombre}
            simbolo="$"
          />

          <CrearSubcuentaModal 
            isOpen={modalSubcuentaOpen}
            onClose={() => setModalSubcuentaOpen(false)}
            onSuccess={() => {
              refrescarDatos();
              setModalSubcuentaOpen(false);
            }}
            cuentaPrincipalId={cuenta?.id || ''}
            monedaPrincipal={cuenta.nombre}
            simbolo="$"
          />

          <CrearRecurrenteModal 
            isOpen={modalRecurrenteOpen}
            onClose={() => setModalRecurrenteOpen(false)}
            onSuccess={() => {
              refrescarDatos();
              setModalRecurrenteOpen(false);
            }}
            cuentaId={cuenta._id}
            monedaPrincipal={cuenta.nombre}
            simbolo="$"
          />
        </>
      )}
    </>
  );
}
