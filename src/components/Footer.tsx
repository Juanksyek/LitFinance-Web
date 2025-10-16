export default function Footer() {
  return (
    <footer id="legal" className="mt-16 border-t border-black/5 dark:border-white/10">
      <div className="container-app py-10 text-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="muted">
            © {new Date().getFullYear()} LitFinance. Todos los derechos reservados.
          </p>
          <nav className="flex flex-wrap gap-4">
            <a className="hover:text-primary" href="#privacidad">Privacidad</a>
            <a className="hover:text-primary" href="#terminos">Términos</a>
            <a className="hover:text-primary" href="#soporte">Soporte</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
// commit
