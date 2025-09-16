import { useEffect, useState } from 'react'

const getApiBase = () => {
  return (import.meta.env.VITE_API_BASE_URL || import.meta.env.API_BASE_URL) as string
}

function extractTokenFromLocation() {
  const path = window.location.pathname || ''
  const parts = path.split('/').filter(Boolean)
  if (!parts.length) return null
  const candidate = parts[parts.length - 1]
  if (/^[0-9a-fA-F]{20,}$/.test(candidate)) return candidate
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full text-center space-y-6">
        {!token ? (
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 shadow-md">
            <h2 className="text-2xl font-semibold">¿Qué haces aquí?</h2>
            <p className="mt-2 text-gray-500">Este enlace solo funciona si contiene un token de activación válido.</p>
            <button onClick={goHome} className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white">Ir al inicio</button>
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 shadow-md">
            {status === 'loading' && <div className="text-lg">Activando tu cuenta…</div>}
            {status === 'success' && (
              <>
                <h2 className="text-2xl font-semibold">Cuenta activada 🎉</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <button onClick={goHome} className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white">Ir al inicio</button>
              </>
            )}
            {status === 'expired' && (
              <>
                <h2 className="text-2xl font-semibold">Enlace expirado</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <p className="mt-2 text-sm text-gray-400">El enlace expira en 30 minutos.</p>
                <button onClick={goHome} className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white">Volver al inicio</button>
              </>
            )}
            {status === 'already' && (
              <>
                <h2 className="text-2xl font-semibold">¿Ya activada?</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <button onClick={goHome} className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white">Ir al inicio</button>
              </>
            )}
            {status === 'invalid' && (
              <>
                <h2 className="text-2xl font-semibold">Token inválido</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <button onClick={goHome} className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white">Regresar</button>
              </>
            )}
            {status === 'error' && (
              <>
                <h2 className="text-2xl font-semibold">Error</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <button onClick={goHome} className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white">Regresar</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
