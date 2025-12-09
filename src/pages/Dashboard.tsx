import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import CrearIngresoModal from '../components/CrearIngresoModal';
import CrearEgresoModal from '../components/CrearEgresoModal';
import CrearSubcuentaModal from '../components/CrearSubcuentaModal';
import CrearRecurrenteModal from '../components/CrearRecurrenteModal';
import SubcuentasCard from '../components/SubcuentasCard';
import { useAuth } from '../hooks/useAuth';
import {
  obtenerCuentaPrincipal,
  listarTransacciones,
  listarRecurrentes,
} from '../services';
import { eliminarRecurrente } from '../services/recurrenteService';
import type {
  CuentaPrincipal,
  Subcuenta,
  Transaccion,
  Recurrente,
} from '../types';

export default function Dashboard() {
  const { user, cuentaPrincipal } = useAuth();
  const navigate = useNavigate();

  // Estados para datos de la API
  const [cuenta, setCuenta] = useState<CuentaPrincipal | null>(null);
  // Sincroniza cuentaPrincipal del contexto y localStorage
  useEffect(() => {
    if (cuentaPrincipal) {
      setCuenta(cuentaPrincipal);
      localStorage.setItem('cuentaPrincipal', JSON.stringify(cuentaPrincipal));
    } else {
      const stored = localStorage.getItem('cuentaPrincipal');
      if (stored) {
        try {
          setCuenta(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing stored cuentaPrincipal:', error);
        }
      }
    }
  }, [cuentaPrincipal]);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [recurrentes, setRecurrentes] = useState<Recurrente[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de modales
  const [modalIngresoOpen, setModalIngresoOpen] = useState(false);
  const [modalEgresoOpen, setModalEgresoOpen] = useState(false);
  const [modalSubcuentaOpen, setModalSubcuentaOpen] = useState(false);
  const [modalRecurrenteOpen, setModalRecurrenteOpen] = useState(false);

  // Estados de filtros
  const [busquedaRecurrente, setBusquedaRecurrente] = useState('');
  const [filtroMovimientos, setFiltroMovimientos] = useState<'todos' | 'ingreso' | 'egreso'>('todos');

  // Función para cargar/recargar todos los datos
  const cargarDatosDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar todos los datos en paralelo
      // Usar el servicio ajustado para obtener la cuenta principal
      const [cuentaData, transaccionesData, recurrentesData] = await Promise.all([
        obtenerCuentaPrincipal(),
        listarTransacciones(),
        listarRecurrentes(user?.id || ''),
      ]);

      // Actualizar estados (soporta respuesta { cuenta: { ... } } o directa)
      const cuentaPrincipal: CuentaPrincipal = typeof cuentaData === 'object' && 'cuenta' in cuentaData ? cuentaData.cuenta as CuentaPrincipal : cuentaData as CuentaPrincipal;
      setCuenta(cuentaPrincipal);

      // Transacciones: puede venir como array directo o en .transacciones
      const transaccionesArray = Array.isArray(transaccionesData) 
        ? transaccionesData 
        : (transaccionesData.transacciones || []);
      setTransacciones(transaccionesArray);
      
      // La respuesta de recurrentes puede venir como 'items' o 'recurrentes'
      setRecurrentes(recurrentesData.items || recurrentesData.recurrentes || []);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError('No se pudieron cargar los datos. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Funciones de edición y eliminación
  const handleEditarSubcuenta = (subcuenta: Subcuenta) => {
    // TODO: Implementar edición de subcuenta
    console.log('Editar subcuenta:', subcuenta);
    setModalSubcuentaOpen(true);
  };

  const handleEditarRecurrente = (recurrente: Recurrente) => {
    // TODO: Implementar edición de recurrente
    console.log('Editar recurrente:', recurrente);
    setModalRecurrenteOpen(true);
  };

  const handleEliminarRecurrente = async (id: string) => {
    if (!user || !window.confirm('¿Estás seguro de eliminar este recurrente?')) return;
    
    try {
      await eliminarRecurrente(id);
      await cargarDatosDashboard();
    } catch (error) {
      console.error('Error al eliminar recurrente:', error);
      alert('Error al eliminar el recurrente');
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user) {
      cargarDatosDashboard();
    }
  }, [user, cargarDatosDashboard]);

  // Calcular totales de ingresos y egresos
  const calcularTotales = () => {
    const ingresos = transacciones
      .filter((t) => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);

    const egresos = transacciones
      .filter((t) => t.tipo === 'egreso')
      .reduce((sum, t) => sum + Math.abs(t.monto), 0);

    return { ingresos, egresos };
  };

  // UI de loading
  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <div className="min-h-screen bg-bg flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-content/60">Cargando dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  // UI de error
  if (error) {
    return (
      <>
        <DashboardNavbar />
        <div className="min-h-screen bg-bg flex items-center justify-center pt-20">
          <div className="text-center max-w-md">
            <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-content mb-2">Error</h2>
            <p className="text-content/60 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all"
            >
              Reintentar
            </button>
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
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white"
              >
                <Calendar size={16} />
                <span className="text-sm font-medium">Mes</span>
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
              onSubcuentaChange={cargarDatosDashboard}
            />
          </div>

          {/* Movimientos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-6">
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

            <div className="space-y-3">
              {/* Lista de movimientos */}
              {(() => {
                const movimientosFiltrados = transacciones.filter(t => filtroMovimientos === 'todos' || t.tipo === filtroMovimientos);                
                if (loading) {
                  return (
                    <div className="text-center py-8 text-content/60">
                      <p>Cargando movimientos...</p>
                    </div>
                  );
                }
                
                if (movimientosFiltrados.length === 0) {
                  return (
                    <div className="text-center py-8 text-content/60">
                      <p>No hay movimientos registrados</p>
                    </div>
                  );
                }
                
                return movimientosFiltrados.slice(0, 10).map((mov, index) => (
                <motion.div
                  key={mov.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-neutral-900/30 border border-black/10 dark:border-white/10 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      mov.tipo === 'ingreso' 
                        ? 'bg-green-500/10' 
                        : 'bg-red-500/10'
                    }`}>
                      {mov.tipo === 'ingreso' ? (
                        <TrendingUp size={20} className="text-green-500" />
                      ) : (
                        <TrendingDown size={20} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-content">{mov.concepto}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-content/60">
                          {new Date(mov.fecha).toLocaleDateString('es-MX', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-content/10 text-content/70">
                          {mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    mov.tipo === 'ingreso' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {mov.tipo === 'ingreso' ? '+' : '-'}{cuenta?.simbolo || '$'}{Math.abs(mov.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </motion.div>
                ));
              })()}
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
              cargarDatosDashboard();
              setModalIngresoOpen(false);
            }}
            monedaPrincipal={cuenta.nombre}
            simbolo="$"
          />

          <CrearEgresoModal 
            isOpen={modalEgresoOpen}
            onClose={() => setModalEgresoOpen(false)}
            onSuccess={() => {
              cargarDatosDashboard();
              setModalEgresoOpen(false);
            }}
            monedaPrincipal={cuenta.nombre}
            simbolo="$"
          />

          <CrearSubcuentaModal 
            isOpen={modalSubcuentaOpen}
            onClose={() => setModalSubcuentaOpen(false)}
            onSuccess={() => {
              cargarDatosDashboard();
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
              cargarDatosDashboard();
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
