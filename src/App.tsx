import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import Activate from './pages/Activate'
import SmoothScroll from './components/SmoothScroll'
import { I18nProvider } from './contexts/I18nContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TermsAndConditions from './components/TermsAndConditions'
import PrivacyPolicy from './components/PrivacyPolicy'

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <I18nProvider>
        <SmoothScroll />
        
        <Routes>
          {/* Rutas de activación */}
          <Route path="/activate/:token" element={<Activate />} />
          <Route path="/activate" element={<Activate />} />
            
          {/* Rutas legales standalone (para navegación in-app) */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/terminos" element={<PageLayout><TermsAndConditions /></PageLayout>} />
          <Route path="/privacidad" element={<PageLayout><PrivacyPolicy /></PageLayout>} />

          {/* Ruta principal */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />
        </Routes>
      </I18nProvider>
    </Router>
  )
}
