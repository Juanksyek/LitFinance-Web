import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { listarSubcuentas, eliminarSubcuenta } from '../services/subcuentaService';
import type { Subcuenta } from '../types';
import { useAuth } from '../hooks/useAuth';

interface SubcuentasCardProps {
  onOpenModal: () => void;
  onEditSubcuenta?: (subcuenta: Subcuenta) => void;
  onSubcuentaChange?: () => void;
}

export default function SubcuentasCard({ 
  onOpenModal, 
  onEditSubcuenta,
  onSubcuentaChange 
}: SubcuentasCardProps) {
  const { cuentaPrincipal } = useAuth();
  const [subcuentas, setSubcuentas] = useState<Subcuenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [soloActivas, setSoloActivas] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const ITEMS_POR_PAGINA = 5;

  const cargarSubcuentas = useCallback(async () => {
    const cuentaId = cuentaPrincipal?.id || cuentaPrincipal?._id || '';
    if (!cuentaId) {
      console.log('⚠️ SubcuentasCard - No hay cuentaPrincipal.id, saliendo...');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await listarSubcuentas(cuentaId, {
        soloActivas: soloActivas || undefined,
        page: paginaActual,
        limit: ITEMS_POR_PAGINA
      });
      let subcuentasArray: Subcuenta[] = [];
      if (Array.isArray(response)) {
        subcuentasArray = response;
      } else if (response && Array.isArray(response.subcuentas)) {
        subcuentasArray = response.subcuentas;
      } else {
        console.warn('[SubcuentasCard] Respuesta inesperada de listarSubcuentas:', response);
      }
      setSubcuentas(subcuentasArray);
      setTotalPaginas(1);
    } catch (error) {
      console.error('❌ SubcuentasCard - Error cargando subcuentas:', error);
      setSubcuentas([]);
    } finally {
      console.log('🏁 SubcuentasCard - setLoading(false)');
      setLoading(false);
    }
  }, [cuentaPrincipal?.id, cuentaPrincipal?._id, soloActivas, paginaActual]);

  useEffect(() => {
    const cuentaId = cuentaPrincipal?.id || cuentaPrincipal?._id || '';
    if (cuentaId) {
      cargarSubcuentas();
    } else {
      setLoading(false);
    }
  }, [cuentaPrincipal, cargarSubcuentas]);

  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta subcuenta?')) return;
    
    try {
      await eliminarSubcuenta(id);
      await cargarSubcuentas();
      onSubcuentaChange?.();
    } catch (error) {
      console.error('Error al eliminar subcuenta:', error);
      alert('Error al eliminar la subcuenta');
    }
  };

  const handleEditar = (subcuenta: Subcuenta) => {
    onEditSubcuenta?.(subcuenta);
  };

  // Filtrar subcuentas por búsqueda (en el lado del cliente)
  const subcuentasFiltradas = subcuentas.filter(s =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Mapeo de colores
  const colorMap: Record<string, string> = {
    'Verde': 'border-green-500 bg-green-500/10',
    'Azul': 'border-blue-500 bg-blue-500/10',
    'Naranja': 'border-orange-500 bg-orange-500/10',
    'Rojo': 'border-red-500 bg-red-500/10',
    'Morado': 'border-purple-500 bg-purple-500/10',
    'Rosa': 'border-pink-500 bg-pink-500/10',
    'Cyan': 'border-cyan-500 bg-cyan-500/10',
    'Amarillo': 'border-yellow-500 bg-yellow-500/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-content">Subcuentas</h3>
        <motion.button
          onClick={onOpenModal}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-primary/10 transition-all"
        >
          <Plus size={20} className="text-primary" />
        </motion.button>
      </div>

      {/* Búsqueda */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar subcuenta..."
          className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
        />
      </div>

      {/* Toggle Solo Activas */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium text-content">Mostrar solo activas</label>
        <button 
          onClick={() => {
            setSoloActivas(!soloActivas);
            setPaginaActual(1); // Reset a primera página
          }}
          className={`relative w-12 h-6 rounded-full transition-all ${
            soloActivas ? 'bg-primary' : 'bg-content/20'
          }`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
            soloActivas ? 'left-7' : 'left-1'
          }`} />
        </button>
      </div>

      {/* Lista de Subcuentas */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-content/60">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Cargando subcuentas...</p>
          </div>
        ) : subcuentasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-content/60">
            <p>No hay subcuentas {soloActivas ? 'activas' : 'registradas'}</p>
          </div>
        ) : (
          subcuentasFiltradas.map((item, index) => {
            const colorClasses = item.color 
              ? colorMap[item.color] || 'border-gray-500 bg-gray-500/10' 
              : 'border-gray-500 bg-gray-500/10';

            return (
              <motion.div
                key={item.id || item._id || item.subCuentaId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border-2 ${colorClasses} ${
                  !item.activa && 'opacity-60'
                } transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.color ? colorMap[item.color]?.replace('border-', 'bg-').replace('/10', '/20') : 'bg-gray-500/20'
                    }`}>
                      <span className="text-xl font-bold">{item.nombre.charAt(0).toUpperCase()}</span>
                    </div>
                    <h4 className="font-semibold text-content">{item.nombre}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.activa && <CheckCircle size={18} className="text-green-500" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditar(item);
                      }}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-all"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminar(item.id || item._id || item.subCuentaId || '');
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
                    {item.simbolo || '$'}{item.cantidad.toFixed(2)}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.activa 
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                      : 'bg-content/10 text-content/60'
                  }`}>
                    {item.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-black/10 dark:border-white/10">
        <button 
          onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
          disabled={paginaActual === 1}
          className={`text-sm ${
            paginaActual === 1 
              ? 'text-content/30 cursor-not-allowed' 
              : 'text-content/50 hover:text-primary cursor-pointer'
          }`}
        >
          Anterior
        </button>
        <span className="text-sm font-medium text-content">
          Página {paginaActual} de {totalPaginas || 1}
        </span>
        <button 
          onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
          className={`text-sm ${
            paginaActual === totalPaginas || totalPaginas === 0
              ? 'text-content/30 cursor-not-allowed' 
              : 'text-content/50 hover:text-primary cursor-pointer'
          }`}
        >
          Siguiente
        </button>
      </div>
    </motion.div>
  );
}
