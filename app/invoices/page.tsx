"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Trash2, Plus } from "lucide-react"

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  totalAmount: number
  date: string
}

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = () => {
    const stored = localStorage.getItem("invoices")
    if (stored) {
      const parsed = JSON.parse(stored)
      setInvoices(parsed)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const updated = invoices.filter((inv) => inv.id !== id)
      setInvoices(updated)
      localStorage.setItem("invoices", JSON.stringify(updated))
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all invoices? This action cannot be undone.")) {
      setInvoices([])
      localStorage.setItem("invoices", JSON.stringify([]))
    }
  }

  const filtered = invoices
    .filter(
      (inv) =>
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return b.totalAmount - a.totalAmount
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
              {filtered.length === 0 ? (
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
                            <span className="font-semibold text-primary">{invoice.invoiceNumber}</span>
                          </td>
                          <td className="text-foreground">{invoice.customerName}</td>
                          <td className="text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</td>
                          <td className="font-semibold text-foreground">₦{invoice.totalAmount.toFixed(2)}</td>
                          <td>
                            <div className="flex gap-2">
                              <Link href={`/invoices/${invoice.id}`}>
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

          {invoices.length > 0 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
              >
                Clear All Invoices
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
