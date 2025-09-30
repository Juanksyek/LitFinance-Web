import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(
        (document.documentElement.getAttribute('data-theme') as Theme) || 'light'
    )

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

    return { theme, setTheme, toggle }
}
