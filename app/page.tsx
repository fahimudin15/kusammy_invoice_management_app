"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { DollarSign, FileText, TrendingUp } from "lucide-react"

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  totalAmount: number
  date: string
  items: any[]
}

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [stats, setStats] = useState({ total: 0, revenue: 0 })

  useEffect(() => {
    const stored = localStorage.getItem("invoices")
    if (stored) {
      const parsed = JSON.parse(stored)
      setInvoices(parsed)
      const revenue = parsed.reduce((sum: number, inv: Invoice) => sum + inv.totalAmount, 0)
      setStats({
        total: parsed.length,
        revenue,
      })
    }
  }, [])

  const recentInvoices = invoices.slice(-5).reverse()

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your invoice overview.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                <FileText className="h-8 w-8 text-primary opacity-20" />
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold text-foreground">₦{stats.revenue.toFixed(2)}</div>
                <DollarSign className="h-8 w-8 text-primary opacity-20" />
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Invoice</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold text-foreground">
                  ₦{stats.total > 0 ? (stats.revenue / stats.total).toFixed(2) : "0.00"}
                </div>
                <TrendingUp className="h-8 w-8 text-primary opacity-20" />
              </CardContent>
            </Card>
          </div>

          {/* Recent Invoices */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>Your latest invoice activity</CardDescription>
                </div>
                <Link href="/invoices/create">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Create Invoice</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentInvoices.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No invoices yet. Create your first invoice to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInvoices.map((invoice) => (
                    <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-border">
                        <div>
                          <p className="font-medium text-foreground">{invoice.customerName}</p>
                          <p className="text-sm text-muted-foreground">#{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">₦{invoice.totalAmount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
