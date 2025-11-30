"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Settings, Home } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">Kusammy Store</span>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/">
              <div
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isActive("/") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </div>
            </Link>

            <Link href="/invoices">
              <div
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isActive("/invoices") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Invoices</span>
              </div>
            </Link>

            <Link href="/settings">
              <div
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isActive("/settings") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
