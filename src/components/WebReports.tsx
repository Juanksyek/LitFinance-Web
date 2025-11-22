import React, { useState } from 'react';
import type { 
  CreateWebReportRequest, 
  WebReportStatusResponse
} from '../types/reports';
import { webReportsService } from '../services/webReportsService';

export const WebReports: React.FC = () => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [showStatusQuery, setShowStatusQuery] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📋 Centro de Reportes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ¿Necesitas ayuda? Reporta un problema o consulta el estado de tu solicitud
        </p>
      </div>

      {/* Opciones principales */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🆘</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Reportar Problema
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Envía un reporte sobre problemas técnicos, errores o solicitudes de ayuda
            </p>
            <button
              onClick={() => setShowReportForm(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Reporte
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Consultar Estado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Verifica el estado de tu reporte usando el ID de ticket que recibiste
            </p>
            <button
              onClick={() => setShowStatusQuery(true)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Consultar Estado
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showReportForm && (
        <ReportFormModal onClose={() => setShowReportForm(false)} />
      )}

      {showStatusQuery && (
        <StatusQueryModal onClose={() => setShowStatusQuery(false)} />
      )}
    </div>
  );
};

// Modal para crear reporte
interface ReportFormModalProps {
  onClose: () => void;
}

const ReportFormModal: React.FC<ReportFormModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<CreateWebReportRequest>({
    email: '',
    asunto: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [ticketId, setTicketId] = useState<string>('');

  // Obtener información de rate limit
  const rateLimitInfo = webReportsService.getRateLimitInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await webReportsService.createReport(formData, {
        userAgent: navigator.userAgent
      });

      if (response.success && response.data) {
        setTicketId(response.data.ticketId);
        setMessage({ type: 'success', text: response.message });
        setFormData({ email: '', asunto: '', descripcion: '' });
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al enviar el reporte' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateWebReportRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              📋 Crear Nuevo Reporte
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✖️
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Información de rate limiting */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              ℹ️ Límites de Reportes
            </h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p>• Reportes restantes esta hora: <strong>{rateLimitInfo.hourRemaining}</strong></p>
              <p>• Reportes restantes hoy: <strong>{rateLimitInfo.dayRemaining}</strong></p>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
            }`}>
              {message.text}
              {ticketId && (
                <div className="mt-2">
                  <strong>ID del Ticket:</strong>{' '}
                  <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                    {ticketId}
                  </code>
                  <p className="text-sm mt-1">
                    Guarda este ID para consultar el estado de tu reporte más tarde.
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                placeholder="tu@ejemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asunto *
              </label>
              <input
                type="text"
                value={formData.asunto}
                onChange={(e) => handleChange('asunto', e.target.value)}
                required
                minLength={5}
                maxLength={200}
                placeholder="Describe brevemente el problema"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.asunto.length}/200 caracteres
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                required
                minLength={10}
                maxLength={5000}
                rows={6}
                placeholder="Describe detalladamente el problema o tu consulta..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.descripcion.length}/5000 caracteres
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || rateLimitInfo.hourRemaining === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '⏳ Enviando...' : '📤 Enviar Reporte'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Modal para consultar estado
interface StatusQueryModalProps {
  onClose: () => void;
}

const StatusQueryModal: React.FC<StatusQueryModalProps> = ({ onClose }) => {
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportStatus, setReportStatus] = useState<WebReportStatusResponse | null>(null);
  const [error, setError] = useState('');

  const handleQuery = async () => {
    if (!ticketId.trim()) {
      setError('Por favor, ingresa un ID de ticket válido');
      return;
    }

    setLoading(true);
    setError('');
    setReportStatus(null);

    try {
      const response = await webReportsService.getReportStatus(ticketId.trim());
      if (response.success && response.data) {
        setReportStatus(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error al consultar el estado del reporte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              🔍 Consultar Estado del Reporte
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✖️
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ID del Ticket
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="WEB-1234567890-ABCD1234"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <button
                onClick={handleQuery}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? '⏳' : '🔍 Buscar'}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {reportStatus && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Estado del Reporte</h3>
              
              <div className="space-y-2 text-sm">
                <div><strong>Ticket ID:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{reportStatus.ticketId}</code></div>
                <div><strong>Estado:</strong> {reportStatus.estado}</div>
                <div><strong>Fecha de creación:</strong> {new Date(reportStatus.fechaCreacion).toLocaleString('es-ES')}</div>
                {reportStatus.fechaUltimaActualizacion && (
                  <div><strong>Última actualización:</strong> {new Date(reportStatus.fechaUltimaActualizacion).toLocaleString('es-ES')}</div>
                )}
                {reportStatus.esSospechoso && (
                  <div className="text-yellow-600 dark:text-yellow-400">
                    ⚠️ Este reporte ha sido marcado para revisión adicional
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// commit