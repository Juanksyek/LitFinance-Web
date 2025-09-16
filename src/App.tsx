import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import Activate from './pages/Activate'

function looksLikeToken(seg: string) {
  return /^[0-9a-fA-F]{20,}$/.test(seg)
}

function isActivatePath() {
  try {
    const path = window.location.pathname || ''
    const parts = path.split('/').filter(Boolean)
    if (parts.length === 0) return false
    if (parts[0] === 'confirm') return true
    const last = parts[parts.length - 1]
    if (looksLikeToken(last)) return true
    const q = new URLSearchParams(window.location.search)
    if (q.get('token')) return true
    return false
  } catch {
    return false
  }
}

export default function App() {
  const showActivate = isActivatePath()
  if (showActivate) return <Activate />

  return (
    <>
      <Navbar />
      <Home />
      <Footer />
    </>
  )
}
