"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { invoiceService, Invoice } from "@/lib/invoice-service"

export default function InvoiceDetail() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const invoiceNumber = params.id as string
    loadInvoice(invoiceNumber)
  }, [params.id])

  const loadInvoice = async (invoiceNumber: string) => {
    setLoading(true)
    const { data, error } = await invoiceService.getInvoiceByNumber(invoiceNumber)

    if (error) {
      console.error("Error loading invoice:", error)
      setLoading(false)
      return
    }

    setInvoice(data)
    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    const element = document.getElementById("invoice-content")
    if (!element) return

    try {
      const canvas = await html2canvas(element, { scale: 2 })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const width = pdf.internal.pageSize.getWidth()
      const height = (canvas.height * width) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 0, width, height)
      pdf.save(`${invoice?.invoice_number}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background p-4 sm:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </>
    )
  }

  if (!invoice) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background p-4 sm:p-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Invoice not found</p>
            <Link href="/invoices">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Back to Invoices</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 print:hidden">
            <Link href="/invoices">
              <Button variant="ghost" className="gap-2 text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button onClick={handlePrint} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Invoice Content */}
          <Card className="bg-card border border-border">
            <CardContent className="p-8" id="invoice-content">
              {/* Header */}
              <div className="mb-8 pb-8 border-b border-border">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">INVOICE</h1>
                    <p className="text-lg font-semibold text-primary mt-2">{invoice.invoice_number}</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-bold text-foreground">
                      {invoice.company_info?.name || "Kusammy Store"}
                    </h2>
                    {invoice.company_info?.address && (
                      <p className="text-sm text-muted-foreground mt-1">{invoice.company_info.address}</p>
                    )}
                    {invoice.company_info?.phone && (
                      <p className="text-sm text-muted-foreground">{invoice.company_info.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer & Date Info */}
              <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Bill To</h3>
                  <p className="font-semibold text-foreground">{invoice.customer_name}</p>
                  {invoice.customer_phone && <p className="text-sm text-muted-foreground">{invoice.customer_phone}</p>}
                  {invoice.customer_address && (
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{invoice.customer_address}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">Invoice Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-right">Quantity</th>
                      <th className="text-right">Unit Price</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="text-foreground">{item.productName}</td>
                        <td className="text-right text-foreground">{item.quantity}</td>
                        <td className="text-right text-foreground">₦{item.unitPrice.toFixed(2)}</td>
                        <td className="text-right font-semibold text-foreground">₦{item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₦{Number(invoice.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-3 pb-3 border-b border-border">
                    <span className="text-muted-foreground">Tax ({invoice.tax}%)</span>
                    <span className="text-foreground">₦{Number(invoice.tax_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">₦{Number(invoice.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Notes</h3>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
