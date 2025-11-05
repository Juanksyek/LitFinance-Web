import React, { useState, useEffect, useCallback } from 'react';
import type { WebReport, SecurityStats, WebReportStatus } from '../types/reports';
import { WEB_STATUS_LABELS, STATUS_COLORS, WEB_REPORT_STATUSES } from '../constants/reports';
import { webReportsService } from '../services/webReportsService';
import { authService } from '../services/authService';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [reports, setReports] = useState<WebReport[]>([]);
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<WebReportStatus | ''>('');
  const [selectedReport, setSelectedReport] = useState<WebReport | null>(null);
  const [error, setError] = useState<string>('');

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await webReportsService.getAdminReports({
        estado: filterStatus || undefined,
        pagina: currentPage,
        limite: 10
      });

      if (response.success && response.data) {
        setReports(response.data.data);
        setTotalPages(response.data.totalPaginas);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error cargando reportes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus]);

  useEffect(() => {
    loadReports();
    loadSecurityStats();
  }, [loadReports]);

  const loadSecurityStats = async () => {
    try {
      const response = await webReportsService.getSecurityStats();
      if (response.success && response.data) {
        setSecurityStats(response.data);
      }
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  const markAsSpam = async (ticketId: string) => {
    if (!confirm('¿Estás seguro de marcar este reporte como spam?')) return;

    try {
      const response = await webReportsService.markReportAsSpam(ticketId);
      if (response.success) {
        loadReports();
        setSelectedReport(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error marcando como spam');
      console.error(err);
    }
  };

  const logout = () => {
    authService.logout();
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return '#10b981';
    if (score < 50) return '#f59e0b'; // Amarillo
    if (score < 70) return '#f97316'; // Naranja
    return '#ef4444'; // Rojo
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              🛡️ Panel de Administración
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sistema de Reportes - LitFinance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadReports}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              🔄 Recargar
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🚪 Cerrar Sesión
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ✖️ Cerrar
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar con estadísticas */}
          <div className="w-80 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              📊 Estadísticas de Seguridad
            </h2>
            
            {securityStats && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-900 dark:text-white">Reportes Totales</h3>
                  <p className="text-2xl font-bold text-blue-600">{securityStats.reportesTotales}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-900 dark:text-white">Reportes Bloqueados</h3>
                  <p className="text-2xl font-bold text-red-600">{securityStats.reportesBloqueados}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-900 dark:text-white">Puntuación Riesgo Promedio</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold" style={{ color: getRiskColor(securityStats.puntuacionRiesgoPromedio) }}>
                      {securityStats.puntuacionRiesgoPromedio.toFixed(1)}
                    </p>
                    <span className="text-sm text-gray-500">/100</span>
                  </div>
                </div>

                {securityStats.ipsConMasReportes.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">IPs con Más Reportes</h3>
                    <div className="space-y-1">
                      {securityStats.ipsConMasReportes.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-mono">
                            {item.ip.substring(0, 15)}...
                          </span>
                          <span className="font-semibold">{item.cantidad}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel principal */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filtros */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Filtrar por Estado
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as WebReportStatus | '')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Todos los estados</option>
                    {Object.entries(WEB_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Lista de reportes */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando...</span>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No hay reportes para mostrar
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.ticketId}
                      className="bg-white dark:bg-gray-800 border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {report.ticketId}
                            </span>
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: STATUS_COLORS[report.estado] }}
                            >
                              {WEB_STATUS_LABELS[report.estado]}
                            </span>
                            {report.esSospechoso && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                ⚠️ Sospechoso
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {report.asunto}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            De: {report.email}
                          </p>
                          
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            {report.descripcion}
                          </p>

                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>📅 {formatDate(report.fechaCreacion)}</span>
                            <span 
                              className="font-medium"
                              style={{ color: getRiskColor(report.puntuacionRiesgo) }}
                            >
                              🎯 Riesgo: {report.puntuacionRiesgo}/100
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {report.estado !== WEB_REPORT_STATUSES.SPAM && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsSpam(report.ticketId);
                              }}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              🚫 Marcar Spam
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ← Anterior
                  </button>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de detalles del reporte */}
        {selectedReport && (
          <ReportDetailsModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onMarkSpam={() => markAsSpam(selectedReport.ticketId)}
          />
        )}
      </div>
    </div>
  );
};

// Modal para mostrar detalles del reporte
interface ReportDetailsModalProps {
  report: WebReport;
  onClose: () => void;
  onMarkSpam: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ report, onClose, onMarkSpam }) => {
  const getRiskColor = (score: number) => {
    if (score < 30) return '#10b981';
    if (score < 50) return '#f59e0b';
    if (score < 70) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Detalles del Reporte
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✖️
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Información General</h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
              <div><strong>Ticket ID:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">{report.ticketId}</code></div>
              <div><strong>Email:</strong> {report.email}</div>
              <div><strong>Asunto:</strong> {report.asunto}</div>
              <div><strong>Estado:</strong> 
                <span
                  className="ml-2 px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: STATUS_COLORS[report.estado] }}
                >
                  {WEB_STATUS_LABELS[report.estado]}
                </span>
              </div>
              <div><strong>Fecha:</strong> {new Date(report.fechaCreacion).toLocaleString('es-ES')}</div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Descripción</h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{report.descripcion}</p>
            </div>
          </div>

          {/* Análisis de seguridad */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Análisis de Seguridad</h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <strong>Puntuación de Riesgo:</strong>
                <span 
                  className="font-bold text-lg"
                  style={{ color: getRiskColor(report.puntuacionRiesgo) }}
                >
                  {report.puntuacionRiesgo}/100
                </span>
                {report.esSospechoso && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⚠️ Sospechoso
                  </span>
                )}
              </div>

              <div>
                <strong>Validaciones:</strong>
                <ul className="mt-1 space-y-1 text-sm">
                  <li className={report.validacionesContenido.contieneLinksExternos ? 'text-red-600' : 'text-green-600'}>
                    {report.validacionesContenido.contieneLinksExternos ? '❌' : '✅'} Enlaces externos
                  </li>
                  <li className="text-gray-700 dark:text-gray-300">
                    📊 Puntuación spam: {report.validacionesContenido.puntuacionSpam}
                  </li>
                  {report.validacionesContenido.palabrasProhibidas.length > 0 && (
                    <li className="text-red-600">
                      🚫 Palabras prohibidas: {report.validacionesContenido.palabrasProhibidas.join(', ')}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Historial de acciones */}
          {report.historialAcciones.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Historial de Acciones</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="space-y-2">
                  {report.historialAcciones.map((accion, index) => (
                    <div key={index} className="text-sm border-l-2 border-blue-500 pl-3">
                      <div className="font-medium">{accion.accion}</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {new Date(accion.fecha).toLocaleString('es-ES')} - {accion.realizadaPor}
                      </div>
                      {accion.detalles && (
                        <div className="text-gray-700 dark:text-gray-300 mt-1">{accion.detalles}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {report.estado !== WEB_REPORT_STATUSES.SPAM && (
              <button
                onClick={onMarkSpam}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                🚫 Marcar como Spam
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
