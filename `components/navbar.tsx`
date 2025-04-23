"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building, Home, Plus, Settings, Database } from 'lucide-react'
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      label: "Aggiungi",
      href: "/aggiungi",
      icon: Plus,
    },
    {
      label: "Strumenti",
      href: "/strumenti",
      icon: Database,
    },
    {
      label: "Impostazioni",
      href: "/impostazioni",
      icon: Settings,
    },
  ]

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2 font-semibold">
          <Building className="h-6 w-6" />
          <span>Gestionale Immobiliari</span>
        </div>

        <div className="ml-auto flex gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
