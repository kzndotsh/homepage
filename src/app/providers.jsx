'use client'
import { createContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider, useTheme } from 'next-themes'

// Custom hook to get the previous value of a prop or state
function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

// Component to watch for system theme changes and update accordingly
function ThemeWatcher() {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const syncThemeWithSystem = () => {
      const systemPrefersDark = mediaQuery.matches
      const newTheme = systemPrefersDark ? 'dark' : 'light'
      if (resolvedTheme !== newTheme) {
        setTheme(systemPrefersDark ? 'dark' : 'light')
      }
    }

    syncThemeWithSystem()
    mediaQuery.addEventListener('change', syncThemeWithSystem)

    return () => mediaQuery.removeEventListener('change', syncThemeWithSystem)
  }, [resolvedTheme, setTheme])

  return null
}

export const AppContext = createContext(null)

export function Providers({ children }) {
  const currentPathname = usePathname()
  const previousPathname = usePrevious(currentPathname)

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <ThemeWatcher />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  )
}
