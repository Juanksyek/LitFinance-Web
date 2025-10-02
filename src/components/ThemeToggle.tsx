import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../constants/usetTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      className="btn btn-ghost rounded-full p-2"
      aria-label="Cambiar tema"
      title={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
// commit