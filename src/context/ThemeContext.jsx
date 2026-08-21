import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isNight, setIsNight] = useState(() => {
    const saved = localStorage.getItem('rl-theme')
    if (saved) return saved === 'night'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  useEffect(() => {
    const root = document.documentElement
    if (isNight) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('rl-theme', isNight ? 'night' : 'day')
  }, [isNight])

  const toggle = () => setIsNight((v) => !v)

  return (
    <ThemeContext.Provider value={{ isNight, toggle }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
