import { ArrowRight, ShieldCheck, Wallet, Repeat, LineChart, Sparkles, Apple, Smartphone } from 'lucide-react'

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Glow sutil del primario */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/20" />

        <div className="container-app py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge mb-4">Nuevo</span>
            <h1 className="text5xl sm:text-4xl font-extrabold tracking-tight">
              Controla tus ingresos <span className="text-primary">sin complicarte</span>
            </h1>
            <p className="mt-4 text-lg text-content/80">
              Subcuentas, recurrentes, historiales, monedas y más. Todo en una sola App,
              sencilla y segura.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#descargas" className="btn btn-primary">
                Empieza ahora <ArrowRight size={16} />
              </a>
              <a href="#features" className="btn btn-ghost">Ver características</a>
            </div>

            <div className="mt-6 text-xs uppercase tracking-wider text-muted">
              Hecho con cariño, de México para el mundo
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container-app py-12">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Todo lo que necesitas</h2>
          <p className="muted mt-2">Organiza, automatiza y entiende tus finanzas.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Wallet className="h-5 w-5" />} title="Subcuentas">
            Crea espacios para metas: Ahorro, Viaje, Renta… cada una con su saldo e historial.
          </Feature>
          <Feature icon={<Repeat className="h-5 w-5" />} title="Pagos recurrentes">
            Programa servicios (Netflix, Spotify, etc.) y recibe recordatorios inteligentes.
          </Feature>
          <Feature icon={<LineChart className="h-5 w-5" />} title="Reportes claros">
            Filtra por periodo, concepto y moneda. Visualiza ingresos/egresos al instante.
          </Feature>
          <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Seguridad primero">
            Cifrado en tránsito y buenas prácticas desde el diseño.
          </Feature>
          <Feature icon={<Sparkles className="h-5 w-5" />} title="Rápido y simple">
            Interfaz ligera, mínima fricción, experiencia fluida.
          </Feature>
          <Feature icon={<Repeat className="h-5 w-5 rotate-45" />} title="Sync multi-dispositivo">
            Tus datos disponibles donde los necesites.
          </Feature>
        </div>
      </section>

      {/* Descargas */}
      <section id="descargas" className="container-app py-12">
        <div className="card p-6 sm:p-8 rounded-lg">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Descarga la app</h3>
              <p className="muted mt-1">
                Disponible para iOS y Android. Próximamente versión escritorio.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a className="btn btn-primary" href="#">
                <Apple size={16} /> App Store
              </a>
              <a className="btn btn-ghost" href="#">
                <Smartphone size={16} /> Google Play
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Soporte */}
      <section id="soporte" className="container-app py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6 rounded-lg">
            <h3 className="text-lg font-semibold">¿Necesitas ayuda?</h3>
            <p className="muted mt-1">
              Levanta un reporte y nuestro equipo te contactará.
            </p>

            <form className="mt-4 grid gap-3">
              <input className="w-full rounded-lg border border-black/10 bg-white/70 p-3 dark:bg-white/5 dark:border-white/10" placeholder="Tu correo" type="email" />
              <input className="w-full rounded-lg border border-black/10 bg-white/70 p-3 dark:bg-white/5 dark:border-white/10" placeholder="Asunto" />
              <textarea className="min-h-[120px] w-full rounded-lg border border-black/10 bg-white/70 p-3 dark:bg-white/5 dark:border-white/10" placeholder="Describe tu problema..." />
              <button type="button" className="btn btn-primary self-start">Enviar</button>
            </form>
          </div>

          <div className="card p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Preguntas frecuentes</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <details className="rounded-lg bg-white/60 p-3 dark:bg-white/5">
                  <summary className="cursor-pointer font-medium">¿Cómo creo una subcuenta?</summary>
                  <p className="muted mt-2">Desde el Dashboard → “Nueva subcuenta” y define nombre, moneda y color.</p>
                </details>
              </li>
              <li>
                <details className="rounded-lg bg-white/60 p-3 dark:bg-white/5">
                  <summary className="cursor-pointer font-medium">¿Los pagos recurrentes descuentan al crearlos?</summary>
                  <p className="muted mt-2">No. Solo cuando llega la fecha programada.</p>
                </details>
              </li>
              <li>
                <details className="rounded-lg bg-white/60 p-3 dark:bg-white/5">
                  <summary className="cursor-pointer font-medium">¿Puedo exportar mis movimientos?</summary>
                  <p className="muted mt-2">Sí, desde Reportes podrás descargar en CSV/Excel (próximamente).</p>
                </details>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Legal (placeholders para anclas) */}
      <section id="privacidad" className="container-app py-12">
        <div className="card p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Aviso de Privacidad</h3>
          <p className="muted mt-2">Aquí irá tu texto de privacidad. Lo separamos luego en su propia página.</p>
        </div>
      </section>

      <section id="terminos" className="container-app py-12">
        <div className="card p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Términos y Condiciones</h3>
          <p className="muted mt-2">Aquí irá tu texto de términos. También lo separamos después.</p>
        </div>
      </section>
    </main>
  )
}

function Feature({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="card p-5 rounded-lg">
      <div className="flex items-center gap-2 text-primary">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-content/80">{children}</p>
    </div>
  )
}
