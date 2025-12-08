import { Languages } from 'lucide-react'
import { useI18n } from '../hooks/useI18n'

export default function LanguageSelector() {
  const { language, setLanguage } = useI18n()

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="btn btn-ghost rounded-full p-2 flex items-center gap-1.5"
      aria-label="Cambiar idioma"
      title={`Cambiar a ${language === 'es' ? 'English' : 'Español'}`}
    >
      <Languages size={18} />
      <span className="text-xs font-medium uppercase">{language}</span>
      <span className="sr-only">Toggle language</span>
    </button>
  )
}
