// 📋 Página de Reportes - LitFinance
import React from 'react';
import { WebReports } from '../components/WebReports';

export const ReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header de la página */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  LitFinance
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sistema de Reportes y Soporte
                </p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-4">
              <a
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                🏠 Inicio
              </a>
              <a
                href="/about"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ℹ️ Acerca de
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="py-8">
        <WebReports />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                🛡️ Seguridad y Privacidad
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✅ Rate limiting implementado</li>
                <li>✅ Validación anti-spam avanzada</li>
                <li>✅ Detección de contenido malicioso</li>
                <li>✅ Protección contra inyecciones</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                📊 Estadísticas del Sistema
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Límite: 2 reportes por hora</li>
                <li>• Límite: 5 reportes por día</li>
                <li>• Respuesta promedio: &lt; 24h</li>
                <li>• Disponibilidad: 99.9%</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                🤝 Soporte Adicional
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>📧 support@litfinance.com</li>
                <li>💬 Chat en vivo (próximamente)</li>
                <li>📞 Soporte telefónico</li>
                <li>📚 Base de conocimientos</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 LitFinance. Sistema de Reportes desarrollado con ❤️ y máxima seguridad.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              API URL: https://litfinance-api-production.up.railway.app
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};