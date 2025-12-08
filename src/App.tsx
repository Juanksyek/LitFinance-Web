import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import Activate from './pages/Activate'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Historial from './pages/Historial'
import SmoothScroll from './components/SmoothScroll'
import { I18nProvider } from './contexts/I18nContext'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <I18nProvider>
        <AuthProvider>
          <SmoothScroll />
          
          <Routes>
            {/* Rutas de activación */}
            <Route path="/activate/:token" element={<Activate />} />
            <Route path="/activate" element={<Activate />} />
            
            {/* Rutas de autenticación (sin navbar/footer) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Dashboard y páginas protegidas */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/historial" element={<Historial />} />
            
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
        </AuthProvider>
      </I18nProvider>
    </Router>
  )
}
