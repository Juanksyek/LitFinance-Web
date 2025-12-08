import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar } from 'lucide-react';
import Modal from './Modal';
import { crearRecurrente, listarPlataformas } from '../services';
import type { PlataformaRecurrente } from '../types';

interface CrearRecurrenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cuentaId: string;
  monedaPrincipal: string;
  simbolo: string;
  subcuentas?: Array<{ id?: string; _id?: string; subCuentaId?: string; nombre: string }>;
}

export default function CrearRecurrenteModal({
  isOpen,
  onClose,
  onSuccess,
  cuentaId,
  monedaPrincipal,
  simbolo,
  subcuentas = [],
}: CrearRecurrenteModalProps) {
  const [loading, setLoading] = useState(false);
  const [plataformas, setPlataformas] = useState<PlataformaRecurrente[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    monto: '',
    plataformaId: '',
    frecuenciaTipo: 'dia_mes' as 'dia_mes' | 'dia_semana' | 'fecha_fija',
    frecuenciaValor: '',
    afectaCuentaPrincipal: true,
    afectaSubcuenta: false,
    subcuentaId: '',
    recordatorio1: false,
    recordatorio3: false,
    recordatorio7: false,
  });

  useEffect(() => {
    if (isOpen) {
      cargarPlataformas();
    }
  }, [isOpen]);

  const cargarPlataformas = async () => {
    try {
      const data = await listarPlataformas();
      setPlataformas(data);
    } catch (error) {
      console.error('Error al cargar plataformas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const plataformaSeleccionada = plataformas.find(
        (p) => p.id === formData.plataformaId
      );

      if (!plataformaSeleccionada) {
        alert('Por favor selecciona una plataforma');
        setLoading(false);
        return;
      }

      const recordatorios: number[] = [];
      if (formData.recordatorio1) recordatorios.push(1);
      if (formData.recordatorio3) recordatorios.push(3);
      if (formData.recordatorio7) recordatorios.push(7);

      await crearRecurrente({
        nombre: formData.nombre,
        plataforma: {
          plataformaId: plataformaSeleccionada.id,
          nombre: plataformaSeleccionada.nombre,
          color: plataformaSeleccionada.color,
        },
        frecuenciaTipo: formData.frecuenciaTipo,
        frecuenciaValor: formData.frecuenciaValor,
        moneda: monedaPrincipal,
        monto: parseFloat(formData.monto),
        cuentaId: cuentaId,
        subcuentaId: formData.subcuentaId || null,
        afectaCuentaPrincipal: formData.afectaCuentaPrincipal,
        afectaSubcuenta: formData.afectaSubcuenta,
        recordatorios,
      });

      // Reset form
      setFormData({
        nombre: '',
        monto: '',
        plataformaId: '',
        frecuenciaTipo: 'dia_mes',
        frecuenciaValor: '',
        afectaCuentaPrincipal: true,
        afectaSubcuenta: false,
        subcuentaId: '',
        recordatorio1: false,
        recordatorio3: false,
        recordatorio7: false,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al crear recurrente:', error);
      alert('Error al crear el recurrente. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Recurrente" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-content mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Netflix Premium"
            className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-content mb-2">
              Monto <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content/60">
                {simbolo}
              </div>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
              />
            </div>
          </div>

          {/* Plataforma */}
          <div>
            <label className="block text-sm font-medium text-content mb-2">
              Plataforma <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.plataformaId}
              onChange={(e) => setFormData({ ...formData, plataformaId: e.target.value })}
              className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content"
            >
              <option value="">Selecciona una plataforma</option>
              {plataformas && plataformas.length > 0 ? (
                plataformas.map((plat) => (
                  <option key={plat.id} value={plat.id}>
                    {plat.nombre} {plat.categoria && `- ${plat.categoria}`}
                  </option>
                ))
              ) : (
                <option disabled>Cargando plataformas...</option>
              )}
            </select>
          </div>
        </div>

        {/* Frecuencia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-content mb-2">
              <Calendar size={16} className="inline mr-1" />
              Tipo de frecuencia <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.frecuenciaTipo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  frecuenciaTipo: e.target.value as 'dia_mes' | 'dia_semana' | 'fecha_fija',
                  frecuenciaValor: '',
                })
              }
              className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content"
            >
              <option value="dia_mes">Día del mes</option>
              <option value="dia_semana">Día de la semana</option>
              <option value="fecha_fija">Fecha fija</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-content mb-2">
              Valor <span className="text-red-500">*</span>
            </label>
            {formData.frecuenciaTipo === 'dia_mes' && (
              <input
                type="number"
                required
                min="1"
                max="31"
                value={formData.frecuenciaValor}
                onChange={(e) => setFormData({ ...formData, frecuenciaValor: e.target.value })}
                placeholder="15"
                className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content placeholder:text-content/40"
              />
            )}
            {formData.frecuenciaTipo === 'dia_semana' && (
              <select
                required
                value={formData.frecuenciaValor}
                onChange={(e) => setFormData({ ...formData, frecuenciaValor: e.target.value })}
                className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content"
              >
                <option value="">Selecciona un día</option>
                <option value="1">Lunes</option>
                <option value="2">Martes</option>
                <option value="3">Miércoles</option>
                <option value="4">Jueves</option>
                <option value="5">Viernes</option>
                <option value="6">Sábado</option>
                <option value="0">Domingo</option>
              </select>
            )}
            {formData.frecuenciaTipo === 'fecha_fija' && (
              <input
                type="date"
                required
                value={formData.frecuenciaValor}
                onChange={(e) => setFormData({ ...formData, frecuenciaValor: e.target.value })}
                className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content"
              />
            )}
          </div>
        </div>

        {/* Recordatorios */}
        <div>
          <label className="block text-sm font-medium text-content mb-2">
            Recordatorios (días antes)
          </label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.recordatorio1}
                onChange={(e) => setFormData({ ...formData, recordatorio1: e.target.checked })}
                className="w-5 h-5 rounded border-content/20 text-primary focus:ring-primary"
              />
              <span className="text-sm text-content">1 día</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.recordatorio3}
                onChange={(e) => setFormData({ ...formData, recordatorio3: e.target.checked })}
                className="w-5 h-5 rounded border-content/20 text-primary focus:ring-primary"
              />
              <span className="text-sm text-content">3 días</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.recordatorio7}
                onChange={(e) => setFormData({ ...formData, recordatorio7: e.target.checked })}
                className="w-5 h-5 rounded border-content/20 text-primary focus:ring-primary"
              />
              <span className="text-sm text-content">7 días</span>
            </label>
          </div>
        </div>

        {/* Afecta cuenta principal */}
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div>
            <p className="font-medium text-content">Afectar cuenta principal</p>
            <p className="text-sm text-content/60">Descontar de tu saldo total</p>
          </div>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, afectaCuentaPrincipal: !formData.afectaCuentaPrincipal })
            }
            className={`relative w-14 h-7 rounded-full transition-all ${
              formData.afectaCuentaPrincipal ? 'bg-primary' : 'bg-content/20'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                formData.afectaCuentaPrincipal ? 'left-8' : 'left-1'
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
              value={formData.subcuentaId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subcuentaId: e.target.value,
                  afectaSubcuenta: !!e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-primary transition-all text-content"
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
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <RefreshCw size={20} />
                Crear Recurrente
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
