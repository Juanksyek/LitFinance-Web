import { useEffect, useState } from 'react'

const getApiBase = () => {
  return (import.meta.env.VITE_API_BASE_URL || import.meta.env.API_BASE_URL) as string
}

function extractTokenFromLocation() {
  const path = window.location.pathname || ''
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 2 && parts[0] === 'activate' && /^[0-9a-fA-F]{20,}$/.test(parts[1])) {
    return parts[1]
  }
  const q = new URLSearchParams(window.location.search)
  const qt = q.get('token')
  if (qt) return qt
  return null
}

export default function Activate() {
  const [token] = useState<string | null>(() => extractTokenFromLocation())
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'expired' | 'already' | 'invalid' | 'error'>(token ? 'loading' : 'idle')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (!token) return
    let mounted = true
    const api = getApiBase()
    const endpoint = `${api}/auth/confirm/${token}`

    async function run() {
      try {
        setStatus('loading')
        const res = await fetch(endpoint, { method: 'GET' })
        if (!mounted) return
        if (res.status === 200) {
          setStatus('success')
          setMessage('Tu cuenta ha sido activada correctamente. ¡Bienvenido!')
        } else if (res.status === 410) {
          setStatus('expired')
          setMessage('El token ha expirado. Solicita uno nuevo desde la app.')
        } else if (res.status === 409) {
          setStatus('already')
          setMessage('Tu cuenta ya está activada. ¿Qué haces aquí? 😉')
        } else if (res.status === 400 || res.status === 404) {
          setStatus('invalid')
          setMessage('Este enlace no es válido. ¿Cómo llegaste aquí?')
        } else {
          const text = await res.text()
          setStatus('error')
          setMessage(text || 'Error inesperado al activar la cuenta.')
        }
      } catch (err) {
        setStatus('error')
        if (err instanceof Error) {
          setMessage(err.message || 'Error de red al intentar activar la cuenta')
        } else {
          setMessage(String(err) || 'Error de red al intentar activar la cuenta')
        }
      }
    }

    run()
    return () => { mounted = false }
  }, [token])

  const goHome = () => { window.location.href = '/' }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-100 via-white to-orange-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="max-w-xl w-full text-center space-y-6">
        {!token ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-orange-200 dark:border-gray-800 transition-all">
            <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400">¿Qué haces aquí?</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Este enlace solo funciona si contiene un token de activación válido.</p>
            <button
              onClick={goHome}
              className="mt-6 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Ir al inicio
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-orange-200 dark:border-gray-800 transition-all">
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin h-8 w-8 border-4 border-orange-400 border-t-transparent rounded-full mb-2"></div>
                <div className="text-lg font-medium text-orange-600 dark:text-orange-400">Activando tu cuenta…</div>
              </div>
            )}
            {status === 'success' && (
              <>
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Cuenta activada 🎉</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
                <button
                  onClick={goHome}
                  className="mt-6 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  Ir al inicio
                </button>
              </>
            )}
            {status === 'expired' && (
              <>
                <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">Enlace expirado</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">El enlace expira en 30 minutos.</p>
                <button
                  onClick={goHome}
                  className="mt-6 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  Volver al inicio
                </button>
              </>
            )}
            {status === 'already' && (
              <>
                <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400">¿Ya activada?</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
                <button
                  onClick={goHome}
                  className="mt-6 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  Ir al inicio
                </button>
              </>
            )}
            {status === 'invalid' && (
              <>
                <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">Token inválido</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
                <button
                  onClick={goHome}
                  className="mt-6 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  Regresar
                </button>
              </>
            )}
            {status === 'error' && (
              <>
                <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">Error</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
                <button
                  onClick={goHome}
                  className="mt-6 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  Regresar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
// commit