import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { LiquidacionesProvider } from "@/contexts/LiquidacionesContext"
import { Providers } from "@/components/providers"
import { PopulateSampleData } from "@/scripts/populate-sample-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gestión",
  description: "Sistema de gestión de recursos humanos",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <LiquidacionesProvider>
            {children}
            <PopulateSampleData />
            <Toaster richColors position="top-right" />
          </LiquidacionesProvider>
        </Providers>
      </body>
    </html>
  )
}
