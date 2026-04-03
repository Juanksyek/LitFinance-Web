import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import Activate from './pages/Activate'
import SmoothScroll from './components/SmoothScroll'
import { I18nProvider } from './contexts/I18nContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TermsAndConditions from './components/TermsAndConditions'

export default function App() {
  return (
    <Router>
      <I18nProvider>
        <SmoothScroll />
        
        <Routes>
          {/* Rutas de activación */}
          <Route path="/activate/:token" element={<Activate />} />
            <Route path="/activate" element={<Activate />} />
            
            {/* Rutas de autenticación (sin navbar/footer) */}
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

            {/* Rutas públicas con navbar y footer */}
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
