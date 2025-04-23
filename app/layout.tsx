import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gestionale Dati Immobiliari",
  description: "Applicazione per la gestione dei dati immobiliari",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto py-10 px-4">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
