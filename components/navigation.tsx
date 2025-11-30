"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Settings, Home, LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut, loading } = useAuth()

  const isActive = (path: string) => pathname === path

  // Don't show navigation on auth pages
  if (pathname?.startsWith("/auth")) {
    return null
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">Kusammy Store</span>
          </div>

          <div className="flex items-center gap-1">
            {user ? (
              <>
                <Link href="/">
                  <div
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isActive("/") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                      }`}
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </div>
                </Link>

                <Link href="/invoices">
                  <div
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isActive("/invoices") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                      }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Invoices</span>
                  </div>
                </Link>

                <Link href="/settings">
                  <div
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isActive("/settings") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                      }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </div>
                </Link>

                <div className="ml-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground hidden md:inline">{user.email}</span>
                </div>

                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  size="sm"
                  className="ml-1 text-foreground hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Logout</span>
                </Button>
              </>
            ) : (
              !loading && (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
