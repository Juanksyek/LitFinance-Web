import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronDown } from 'lucide-react';
import Modal from './Modal';
import SelectorMoneda from './SelectorMoneda';
import SelectorConcepto from './SelectorConcepto';
import { crearTransaccion, obtenerCuentaPrincipal } from '../services';
import type { Moneda } from '../types/moneda';

interface CrearIngresoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // cuentaId ya no se recibe como prop, se obtiene desde la API
  monedaPrincipal: string;
  simbolo: string;
  subcuentas?: Array<{ id?: string; _id?: string; subCuentaId?: string; nombre: string }>;
  subcuentaIdPreseleccionada?: string;
}

export default function CrearIngresoModal({
  isOpen,
  onClose,
  onSuccess,
  monedaPrincipal,
  simbolo,
  subcuentas = [],
  subcuentaIdPreseleccionada,
}: CrearIngresoModalProps) {
  const [cuentaId, setCuentaId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectorMonedaOpen, setSelectorMonedaOpen] = useState(false);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<Moneda>({
    id: '1',
    codigo: monedaPrincipal,
    nombre: monedaPrincipal,
    simbolo: simbolo
  });
    useEffect(() => {
      // Al abrir el modal, obtener la cuenta principal
      if (isOpen) {
        obtenerCuentaPrincipal().then((cuenta) => {
          setCuentaId(cuenta.id || cuenta._id || '');
          // Actualizar la moneda seleccionada con la de la cuenta
          if (cuenta.moneda && cuenta.simbolo) {
            setMonedaSeleccionada({
              id: cuenta.id || cuenta._id || 'principal',
              codigo: cuenta.moneda,
              nombre: cuenta.moneda,
              simbolo: cuenta.simbolo
            });
          }
        });
      }
    }, [isOpen]);
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    motivo: '',
    afectaCuenta: true,
    subCuentaId: subcuentaIdPreseleccionada || '',
  });

  // Actualizar subCuentaId cuando cambie subcuentaIdPreseleccionada
  useEffect(() => {
    if (subcuentaIdPreseleccionada) {
      setFormData(prev => ({ ...prev, subCuentaId: subcuentaIdPreseleccionada }));
    }
  }, [subcuentaIdPreseleccionada]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await crearTransaccion({
        tipo: 'ingreso',
        monto: parseFloat(formData.monto),
        concepto: formData.concepto,
        motivo: formData.motivo || undefined,
        moneda: monedaSeleccionada.codigo,
        cuentaId: cuentaId,
        afectaCuenta: formData.afectaCuenta,
        subCuentaId: formData.subCuentaId || undefined,
      });

      // Reset form
      setFormData({
        concepto: '',
        monto: '',
        motivo: '',
        afectaCuenta: true,
        subCuentaId: '',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al crear ingreso:', error);
      alert('Error al crear el ingreso. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Agregar ingreso" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Monto y Moneda */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-content mb-2">
                Monto <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content/60">
                  {monedaSeleccionada.simbolo}
                </div>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-green-500 transition-all text-content placeholder:text-content/40"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-content mb-2">
                Moneda
              </label>
              <button
                type="button"
                onClick={() => setSelectorMonedaOpen(true)}
                className="h-[52px] px-4 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl hover:border-primary transition-all text-content font-semibold flex items-center gap-2"
              >
                <span>{monedaSeleccionada.simbolo} {monedaSeleccionada.codigo}</span>
                <ChevronDown size={16} className="text-content/60" />
              </button>
            </div>
          </div>

          {/* Motivo/Concepto con Selector */}
          <div>
            <label className="block text-sm font-medium text-content mb-2">
              Motivo
            </label>
            <SelectorConcepto 
              onSelect={(concepto) => setFormData({ ...formData, concepto })}
            />
          </div>

        {/* Motivo */}
        <div>
          <label className="block text-sm font-medium text-content mb-2">
            Motivo (opcional)
          </label>
          <textarea
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            placeholder="Descripción adicional..."
            rows={3}
            className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-green-500 transition-all text-content placeholder:text-content/40 resize-none"
          />
        </div>

        {/* Afecta cuenta principal */}
        <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-xl border border-green-500/20">
          <div>
            <p className="font-medium text-content">Afectar cuenta principal</p>
            <p className="text-sm text-content/60">Sumar el monto a tu saldo total</p>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, afectaCuenta: !formData.afectaCuenta })}
            className={`relative w-14 h-7 rounded-full transition-all ${
              formData.afectaCuenta ? 'bg-green-500' : 'bg-content/20'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                formData.afectaCuenta ? 'left-8' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Subcuenta (opcional) */}
        {subcuentas.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-content mb-2">
              Subcuenta (opcional)
            </label>
            <select
              value={formData.subCuentaId}
              onChange={(e) => setFormData({ ...formData, subCuentaId: e.target.value })}
              className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-green-500 transition-all text-content"
            >
              <option value="">Ninguna</option>
              {subcuentas.map((sub) => (
                <option key={sub.id || sub._id || sub.subCuentaId} value={sub.id || sub._id || sub.subCuentaId}>
                  {sub.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

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
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <TrendingUp size={20} />
                Crear Ingreso
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
