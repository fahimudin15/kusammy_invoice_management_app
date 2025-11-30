"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Trash2, Plus, Loader2 } from "lucide-react"
import { invoiceService, Invoice } from "@/lib/invoice-service"

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    setLoading(true)
    const { data, error } = await invoiceService.getInvoices()

    if (error) {
      console.error("Error loading invoices:", error)
      setLoading(false)
      return
    }

    if (data) {
      setInvoices(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const { error } = await invoiceService.deleteInvoice(id)

      if (error) {
        alert(`Error deleting invoice: ${error.message}`)
        return
      }

      // Reload invoices after deletion
      loadInvoices()
    }
  }

  const filtered = invoices
    .filter(
      (inv) =>
        inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return Number(b.total_amount) - Number(a.total_amount)
    })

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">All Invoices</h1>
              <p className="text-muted-foreground">Manage and view all your invoices</p>
            </div>
            <Link href="/invoices/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Plus className="h-4 w-4" />
                New Invoice
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by customer name or invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
              className="px-3 py-2 bg-input border border-border text-foreground rounded-lg text-sm"
            >
              <option value="date">Sort by Date (Newest)</option>
              <option value="amount">Sort by Amount (Highest)</option>
            </select>
          </div>

          {/* Invoices Table */}
          <Card className="bg-card border border-border">
            <CardContent className="p-0">
              {loading ? (
                <div className="py-12 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No invoices found</p>
                  <Link href="/invoices/create">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Create your first invoice
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="invoice-table">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((invoice) => (
                        <tr key={invoice.id}>
                          <td>
                            <span className="font-semibold text-primary">{invoice.invoice_number}</span>
                          </td>
                          <td className="text-foreground">{invoice.customer_name}</td>
                          <td className="text-muted-foreground">
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </td>
                          <td className="font-semibold text-foreground">₦{Number(invoice.total_amount).toFixed(2)}</td>
                          <td>
                            <div className="flex gap-2">
                              <Link href={`/invoices/${invoice.invoice_number}`}>
                                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(invoice.id)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
