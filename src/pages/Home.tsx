import { ShieldCheck } from 'lucide-react'
import { useState } from "react";
import TermsAndConditions from "../components/TermsAndConditions";
import PrivacyPolicy from '../components/PrivacyPolicy';
import { AnimatePresence, motion } from 'framer-motion'
import { FileText } from 'lucide-react'

import Hero3D from '../components/Hero3D'
import AppGallery from '../components/AppGallery'
import ModernFeatures from '../components/ModernFeatures'
import TechSpecs from '../components/TechSpecs'
//import Testimonials from '../components/Testimonials'
import DownloadSection from '../components/DownloadSection'

export default function Home() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <main>
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
      {/* <section id="testimonials">
        <Testimonials />
      </section> */}



      {/* Enhanced Download Section */}
      <section id="descargas">
        <DownloadSection />
      </section>

      {/* Legal (placeholders para anclas) */}
      <section id="privacidad" className="container-app py-2 sm:py-3">
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

      <section id="terminos" className="container-app py-4 sm:py-6">
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


