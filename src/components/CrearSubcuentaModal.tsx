import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Palette, ChevronDown } from 'lucide-react';
import Modal from './Modal';
import SelectorMoneda from './SelectorMoneda';
import { crearSubcuenta } from '../services';
import type { Moneda } from '../types/moneda';

interface CrearSubcuentaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cuentaPrincipalId: string;
  monedaPrincipal: string;
  simbolo: string;
}

const COLORES_DISPONIBLES = [
  { nombre: 'Verde', valor: '#4CAF50' },
  { nombre: 'Azul', valor: '#2196F3' },
  { nombre: 'Naranja', valor: '#FF9800' },
  { nombre: 'Rojo', valor: '#F44336' },
  { nombre: 'Morado', valor: '#9C27B0' },
  { nombre: 'Rosa', valor: '#E91E63' },
  { nombre: 'Cyan', valor: '#00BCD4' },
  { nombre: 'Amarillo', valor: '#FFC107' },
];

export default function CrearSubcuentaModal({
  isOpen,
  onClose,
  onSuccess,
  cuentaPrincipalId,
  monedaPrincipal,
  simbolo,
}: CrearSubcuentaModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectorMonedaOpen, setSelectorMonedaOpen] = useState(false);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<Moneda>({
    id: '1',
    codigo: monedaPrincipal,
    nombre: monedaPrincipal,
    simbolo: simbolo
  });
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    color: 'Verde',
    afectaCuenta: true,
  });

  const cuentaPrincipalIdValida = cuentaPrincipalId && cuentaPrincipalId !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('[CrearSubcuentaModal] cuentaPrincipalId:', cuentaPrincipalId);

    if (!cuentaPrincipalIdValida) {
      alert('Error: No se encontró la cuenta principal. No se puede crear la subcuenta. Por favor recarga la página o verifica tu sesión.');
      setLoading(false);
      return;
    }

    try {
      await crearSubcuenta({
        nombre: formData.nombre,
        cantidad: parseFloat(formData.cantidad),
        moneda: monedaSeleccionada.nombre,
        simbolo: monedaSeleccionada.simbolo,
        color: formData.color,
        afectaCuenta: formData.afectaCuenta,
        cuentaPrincipalId: cuentaPrincipalId,
      });

      // Reset form
      setFormData({
        nombre: '',
        cantidad: '',
        color: 'Verde',
        afectaCuenta: true,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al crear subcuenta:', error);
      alert('Error al crear la subcuenta. Por favor intenta de nuevo o verifica que la cuenta principal esté activa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Nueva Subcuenta" size="md">
        {!cuentaPrincipalIdValida && (
          <div className="text-red-500 font-bold mb-4">No se encontró la cuenta principal. No se puede crear una subcuenta.</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-content mb-2">
              Nombre de la subcuenta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Ahorros"
              className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
            />
          </div>

          {/* Selector de Moneda */}
          <div>
            <label className="block text-sm font-medium text-content mb-2">
              Moneda
            </label>
            <button
              type="button"
              onClick={() => setSelectorMonedaOpen(true)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none hover:border-primary transition-all text-content flex items-center justify-between"
            >
              <span>
                {monedaSeleccionada.nombre} ({monedaSeleccionada.codigo})
              </span>
              <ChevronDown size={20} className="text-content/60" />
            </button>
            {/* Botón de submit eliminado, solo debe haber uno al final */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content/60">
                {monedaSeleccionada.simbolo}
              </div>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
            />
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-content mb-2">
            <Palette size={16} className="inline mr-1" />
            Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {COLORES_DISPONIBLES.map((color) => (
              <button
                key={color.valor}
                type="button"
                onClick={() => setFormData({ ...formData, color: color.nombre })}
                className={`h-12 rounded-xl transition-all ${
                  formData.color === color.nombre
                    ? 'ring-4 ring-offset-2 ring-primary ring-offset-bg'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.valor }}
                title={color.nombre}
              />
            ))}
          </div>
        </div>

        {/* Afecta cuenta principal */}
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div>
            <p className="font-medium text-content">Descontar de cuenta principal</p>
            <p className="text-sm text-content/60">Restar el monto inicial de tu saldo</p>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, afectaCuenta: !formData.afectaCuenta })}
            className={`relative w-14 h-7 rounded-full transition-all ${
              formData.afectaCuenta ? 'bg-primary' : 'bg-content/20'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                formData.afectaCuenta ? 'left-8' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-content/10 text-content font-medium hover:bg-content/5 transition-all disabled:opacity-50"
          >
            Cancelar
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Plus size={20} />
                Crear Subcuenta
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>

    {/* Selector de Moneda */}
    <SelectorMoneda 
      isOpen={selectorMonedaOpen}
      onClose={() => setSelectorMonedaOpen(false)}
      onSelect={(moneda) => setMonedaSeleccionada(moneda)}
      monedaActual={monedaSeleccionada}
    />
    </>
  );
}
