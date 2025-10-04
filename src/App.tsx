import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import Activate from './pages/Activate'
import { ReportsDashboard } from './components/ReportsDashboard'
import SmoothScroll from './components/SmoothScroll'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <SmoothScroll />
      
      <Routes>
        <Route path="/activate/:token" element={<Activate />} />
        <Route path="/activate" element={<Activate />} />
        
        {/* Rutas dinámicas del dashboard - captura admin-* */}
        <Route path="/admin-*" element={<ReportsDashboard />} />
        
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
    </Router>
  )
}
