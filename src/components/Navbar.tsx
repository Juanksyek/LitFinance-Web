import ThemeToggle from './ThemeToggle'
import { Download } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60 border-b border-black/5 dark:border-white/10">
      <div className="container-app flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src="/images/LitFinance.png" alt="LitFinance" className="h-8 w-8 rounded-lg" />
          <span className="font-semibold">LitFinance</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm hover:text-primary">Características</a>
          <a href="#descargas" className="text-sm hover:text-primary">Descargas</a>
          <a href="#soporte" className="text-sm hover:text-primary">Soporte</a>
          <a href="#faq" className="text-sm hover:text-primary">FAQ</a>
          <a href="#legal" className="text-sm hover:text-primary">Legal</a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#descargas" className="btn btn-primary hidden sm:inline-flex">
            <Download size={16} /> Descargar
          </a>
        </div>
      </div>
    </header>
  )
}
// commit