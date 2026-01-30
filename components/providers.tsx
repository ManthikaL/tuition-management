'use client'

import React from "react"

import { ThemeProvider } from 'next-themes'
import { AppProvider } from '@/contexts/app-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppProvider>
        {children}
      </AppProvider>
    </ThemeProvider>
  )
}
