'use client'
import { createContext, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from 'next-themes'

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export const AppContext = createContext(null)

export function Providers({ children }) {
  const currentPathname = usePathname()
  const previousPathname = usePrevious(currentPathname)

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  )
}
