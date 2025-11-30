"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { StatCard } from "@/components/stat-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { BottomNav } from "@/components/bottom-nav"
import { DollarSign, FileText, TrendingUp, Package, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { invoiceService, Invoice } from "@/lib/invoice-service"

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [stats, setStats] = useState({ total: 0, revenue: 0, todayRevenue: 0, todayCount: 0 })
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      loadInvoices()
    }
  }, [user, authLoading, router])

  const loadInvoices = async () => {
    setLoading(true)

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("⚠️ Supabase not configured. Please add your credentials to .env.local")
      setLoading(false)
      return
    }

    const { data, error } = await invoiceService.getInvoices()

    if (error) {
      console.error("Error loading invoices:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      setLoading(false)
      return
    }

    if (data) {
      setInvoices(data)
      const revenue = data.reduce((sum, inv) => sum + Number(inv.total_amount), 0)

      // Calculate today's stats
      const today = new Date().toDateString()
      const todayInvoices = data.filter(inv => new Date(inv.created_at).toDateString() === today)
      const todayRevenue = todayInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0)

      setStats({
        total: data.length,
        revenue,
        todayRevenue,
        todayCount: todayInvoices.length,
      })
    }
    setLoading(false)
  }

  const recentInvoices = invoices.slice(0, 5)

  if (authLoading || loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background breathing-space pb-24 md:pb-8">
          <LoadingSpinner />
        </main>
        <BottomNav />
      </>
    )
  }

  if (!user) {
    return null
  }

  // Get user's first name for greeting
  const userName = user.email?.split('@')[0] || 'Kusammy'

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background breathing-space pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Warm Welcome Message */}
          <div className="mb-8 md:mb-12 animate-slide-up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
              Hello {userName}! 👋
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Here's your activity today
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <StatCard
              title="Today's Sales"
              value={`₦${stats.todayRevenue.toLocaleString()}`}
              icon={DollarSign}
              iconColor="text-primary"
              trend={stats.todayCount > 0 ? { value: `${stats.todayCount} invoice${stats.todayCount > 1 ? 's' : ''}`, isPositive: true } : undefined}
            />

            <StatCard
              title="Total Invoices"
              value={stats.total}
              icon={FileText}
              iconColor="text-accent"
            />

            <StatCard
              title="Total Revenue"
              value={`₦${stats.revenue.toLocaleString()}`}
              icon={TrendingUp}
              iconColor="text-primary"
            />

            <StatCard
              title="Average Invoice"
              value={stats.total > 0 ? `₦${Math.round(stats.revenue / stats.total).toLocaleString()}` : "₦0"}
              icon={Package}
              iconColor="text-accent"
            />
          </div>

          {/* Recent Invoices */}
          <Card className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 md:px-8 py-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">Recent Invoices</h2>
                  <p className="text-sm text-muted-foreground">Your latest sales</p>
                </div>
                <Link href="/invoices/create" className="hidden md:block">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary-hover gap-2 glow-orange font-semibold px-6 py-6 text-base rounded-xl">
                    <Plus className="h-5 w-5" />
                    New Invoice
                  </Button>
                </Link>
              </div>
            </div>

            <CardContent className="p-0">
              {recentInvoices.length === 0 ? (
                <EmptyState
                  emoji="😊"
                  title="No invoices today"
                  description="Start selling your Gandour products!"
                  action={
                    <Link href="/invoices/create">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary-hover gap-2 glow-orange font-semibold px-8 py-6 text-base rounded-xl">
                        <Plus className="h-5 w-5" />
                        Create my first invoice
                      </Button>
                    </Link>
                  }
                />
              ) : (
                <div className="divide-y divide-border">
                  {recentInvoices.map((invoice, index) => (
                    <Link key={invoice.id} href={`/invoices/${invoice.invoice_number}`}>
                      <div
                        className="flex items-center justify-between p-4 md:p-6 hover:bg-secondary/50 transition-all duration-200 cursor-pointer group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            🧴
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {invoice.customer_name}
                            </p>
                            <p className="text-sm text-muted-foreground">#{invoice.invoice_number}</p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-lg text-primary">₦{Number(invoice.total_amount).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(invoice.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* View All Link */}
          {recentInvoices.length > 0 && (
            <div className="mt-6 text-center">
              <Link href="/invoices">
                <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-6 text-base rounded-xl transition-all duration-300">
                  View all invoices →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Desktop Floating Action Button */}
      <Link href="/invoices/create" className="hidden md:block">
        <div className="fab">
          <Plus className="h-7 w-7" strokeWidth={3} />
        </div>
      </Link>
    </>
  )
}
