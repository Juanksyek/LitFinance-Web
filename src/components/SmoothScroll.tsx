import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.hash) {
        e.preventDefault()
        const element = document.querySelector(target.hash)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach(link => {
      link.addEventListener('click', handleClick)
    })

    // Cleanup
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleClick)
      })
    }
  }, [])

  return null
}