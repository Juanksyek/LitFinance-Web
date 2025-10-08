import { ShieldCheck } from 'lucide-react'
import { useState } from "react";
import TermsAndConditions from "../components/TermsAndConditions";
import PrivacyPolicy from '../components/PrivacyPolicy';
import { AnimatePresence, motion } from 'framer-motion'
import { Info, FileText } from 'lucide-react'

import Hero3D from '../components/Hero3D'
import AppGallery from '../components/AppGallery'
import ModernFeatures from '../components/ModernFeatures'
import TechSpecs from '../components/TechSpecs'
import Testimonials from '../components/Testimonials'
import DownloadSection from '../components/DownloadSection'

export default function Home() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  const [reportForm, setReportForm] = useState({
    email: '',
    asunto: '',
    descripcion: ''
  });
  const [ticketId, setTicketId] = useState<string>('');

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!reportForm.email || !reportForm.asunto || !reportForm.descripcion) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      // Generar ID temporal
      const tempId = 'RPT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setTicketId(tempId);
      alert(`¡Mensaje enviado! ID de referencia: ${tempId}`);
      
      // Limpiar formulario
      setReportForm({
        email: '',
        asunto: '',
        descripcion: ''
      });
    } catch {
      alert('Error al enviar el mensaje. Intenta más tarde.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setReportForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <main>
      {/* New Hero 3D */}
      <Hero3D />

      {/* App Gallery */}
      <section id="gallery">
        <AppGallery />
      </section>

      {/* Modern Features - Enhanced version */}
      <section id="features">
        <ModernFeatures />
      </section>

      {/* Tech Specs */}
      <section id="specs">
        <TechSpecs />
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <Testimonials />
      </section>



      {/* Enhanced Download Section */}
      <section id="descargas">
        <DownloadSection />
      </section>

      {/* Soporte */}
      <motion.section
        id="soporte"
        className="container-app py-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Info size={18} /> ¿Necesitas ayuda?
            </h3>
            <p className="muted mt-1">
              Levanta un reporte y nuestro equipo te contactará.
            </p>

            <form className="mt-4 grid gap-3" onSubmit={handleReportSubmit}>
              <input 
                className="w-full rounded-lg border border-black/10 bg-white/70 p-3 dark:bg-white/5 dark:border-white/10" 
                placeholder="Tu correo" 
                type="email"
                value={reportForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              <input 
                className="w-full rounded-lg border border-black/10 bg-white/70 p-3 dark:bg-white/5 dark:border-white/10" 
                placeholder="Asunto"
                value={reportForm.asunto}
                onChange={(e) => handleInputChange('asunto', e.target.value)}
                required
              />
              <textarea 
                className="min-h-[120px] w-full rounded-lg border border-black/10 bg-white/70 p-3 dark:bg-white/5 dark:border-white/10" 
                placeholder="Describe tu problema..."
                value={reportForm.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary self-start" 
                disabled={false}
              >
                📤 Enviar Mensaje
              </button>
              
              {ticketId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    <strong>✅ Reporte enviado exitosamente!</strong><br/>
                    Tu ticket ID es: <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded font-mono text-xs">{ticketId}</code><br/>
                    Guárdalo para consultar el estado de tu reporte.
                  </p>
                </motion.div>
              )}
            </form>
          </div>

          <div className="card p-6 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={18} /> Preguntas frecuentes
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <details className="rounded-lg bg-white/60 p-3 dark:bg-white/5">
                  <summary className="cursor-pointer font-medium">¿Cómo creo una subcuenta?</summary>
                  <p className="muted mt-2">Desde el Dashboard → “Nueva subcuenta” y define nombre, moneda y color.</p>
                </details>
              </li>
              <li>
                <details className="rounded-lg bg-white/60 p-3 dark:bg-white/5">
                  <summary className="cursor-pointer font-medium">¿Los pagos recurrentes descuentan al crearlos?</summary>
                  <p className="muted mt-2">No. Solo cuando llega la fecha programada.</p>
                </details>
              </li>
              <li>
                <details className="rounded-lg bg-white/60 p-3 dark:bg-white/5">
                  <summary className="cursor-pointer font-medium">¿Puedo exportar mis movimientos?</summary>
                  <p className="muted mt-2">Sí, desde Reportes podrás descargar en CSV/Excel (próximamente).</p>
                </details>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Legal (placeholders para anclas) */}
      <section id="privacidad" className="container-app py-3">
        <div className="card p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck size={18} /> Aviso de Privacidad
            </span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setShowPrivacy((prev) => !prev)}
              aria-expanded={showPrivacy}
            >
              {showPrivacy ? "Cerrar" : "Ver"}
            </button>
          </div>
          <AnimatePresence>
            {showPrivacy ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <PrivacyPolicy />
              </motion.div>
            ) : (
              <p className="muted mt-2">Haz clic en "Ver" para ver el aviso de privacidad.</p>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section id="terminos" className="container-app py-6">
        <div className="card p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold flex items-center gap-2">
              <FileText size={18} /> Términos y Condiciones
            </span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setShowTerms((prev) => !prev)}
              aria-expanded={showTerms}
            >
              {showTerms ? "Cerrar" : "Ver"}
            </button>
          </div>
          <AnimatePresence>
            {showTerms ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <TermsAndConditions />
              </motion.div>
            ) : (
              <p className="muted mt-2">Haz clic en "Ver" para ver los términos y condiciones.</p>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}


