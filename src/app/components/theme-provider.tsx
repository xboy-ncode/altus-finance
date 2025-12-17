"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Aseguramos que solo se renderice si props está listo
  return (
    <NextThemesProvider 
      enableSystem={true} 
      attribute="class" 
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}