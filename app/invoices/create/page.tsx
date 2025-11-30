"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { invoiceService } from "@/lib/invoice-service"

const PRODUCTS = {
  bodyLotions: [
    { name: "Bio Claire Lightening Body Lotion (12.1 fl.oz / 350ml)", price: 4500 },
    { name: "CAROTIS Body Lotion Double Nutrition (8.4 fl.oz / 250ml)", price: 3200 },
    { name: "Diva Maxima Maxi Tone Fade Milk (11.8 fl.oz / 350ml)", price: 4200 },
    { name: "Carotone 3-in-1 Brightening Body Lotion (550ml)", price: 5500 },
    { name: "Dawmy Lightening Body Lotion (16.91 fl.oz / 500ml)", price: 4800 },
  ],
  soaps: [
    { name: "Bio Claire Lightening Care Soap (190g / 6.7oz)", price: 800 },
    { name: "Carotone Brightening Soap (190g / 6.7oz)", price: 850 },
    { name: "CAROTIS Beauty Soap Double Nutrition (200g / 7oz)", price: 900 },
    { name: "Diva Maxima Maxi Tone Clearing Soap (100g / 3.5oz)", price: 600 },
    { name: "Dawmy Purifying Beauty Soap (200g / 7oz)", price: 750 },
    { name: "Maxi Light Beauty Soap (3.8oz / 108g)", price: 700 },
    { name: "Pure Skin Vanishing Care Body Soap (190g / 6.7oz)", price: 850 },
    { name: "G&G Dynamiclair Beauty Soap (190g / 6.7oz)", price: 800 },
    { name: "Pharmaderm Herbal Family Soap (190g / 6.7oz)", price: 750 },
  ],
  creams: [
    { name: "Carotone 3-in-1 Crème Pot/Jar (Brightening)", price: 6500 },
    { name: "Dawmy Lightening Body Cream (10.1 fl.oz / 300g)", price: 5800 },
    { name: "Maxi Light Lightening & Purifying Body Crème (325ml)", price: 6200 },
  ],
  serumsOils: [
    { name: "Carotone Black Spot Corrector Serum B.S.C. (30ml)", price: 3500 },
    { name: "Carotone 3-in-1 Huile Serum Collagen (65ml)", price: 4200 },
    { name: "G&G Teint Uniforme Lightening Beauty Oil (150ml)", price: 4800 },
  ],
}

interface InvoiceItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export default function CreateInvoice() {
  const router = useRouter()
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState("1")
  const [tax, setTax] = useState("0")
  const [companyInfo, setCompanyInfo] = useState({ name: "Your Company", address: "", phone: "" })

  useEffect(() => {
    const stored = localStorage.getItem("companyInfo")
    if (stored) {
      setCompanyInfo(JSON.parse(stored))
    }
  }, [])

  const addItem = () => {
    if (!selectedProduct || !quantity) return

    const product = Object.values(PRODUCTS)
      .flat()
      .find((p) => p.name === selectedProduct)
    if (!product) return

    const newItem: InvoiceItem = {
      id: Math.random().toString(),
      productName: selectedProduct,
      quantity: Number.parseInt(quantity),
      unitPrice: product.price,
      total: Number.parseInt(quantity) * product.price,
    }

    setItems([...items, newItem])
    setQuantity("1")
    setSelectedProduct("")
    setSelectedCategory("")
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, quantity: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, quantity, total: quantity * item.unitPrice } : item)))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = (subtotal * Number.parseFloat(tax)) / 100
  const total = subtotal + taxAmount

  const handleSave = async () => {
    if (!customerName.trim()) {
      alert("Please enter a customer name")
      return
    }

    if (items.length === 0) {
      alert("Please add at least one item to the invoice")
      return
    }

    const invoiceNumber = `INV-${Date.now()}`
    const invoiceData = {
      invoice_number: invoiceNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      notes,
      items,
      subtotal,
      tax: Number.parseFloat(tax),
      tax_amount: taxAmount,
      total_amount: total,
      company_info: companyInfo,
    }

    const { data, error } = await invoiceService.createInvoice(invoiceData)

    if (error) {
      alert(`Error creating invoice: ${error.message}`)
      return
    }

    if (data) {
      router.push(`/invoices/${data.invoice_number}`)
    }
  }

  const categoryProducts = selectedCategory
    ? Object.entries(PRODUCTS).find(([key]) => key === selectedCategory)?.[1] || []
    : []

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Invoice</h1>
            <p className="text-muted-foreground">Fill in the details and add items to create a new invoice.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer & Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                  <CardDescription>Add customer information for this invoice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Customer Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-1 bg-input border-border text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="mt-1 bg-input border-border text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Address</label>
                    <Textarea
                      placeholder="123 Main St, City, State 12345"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="mt-1 bg-input border-border text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Notes (Optional)</label>
                    <Textarea
                      placeholder="Add any additional notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 bg-input border-border text-foreground"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Add Items */}
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle>Add Items</CardTitle>
                  <CardDescription>Select products and quantities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="mt-1 bg-input border-border text-foreground">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="bodyLotions">Body Lotions / Fade Milks</SelectItem>
                          <SelectItem value="soaps">Soaps / Beauty Bars</SelectItem>
                          <SelectItem value="creams">Tubs / Jars / Cream Pots</SelectItem>
                          <SelectItem value="serumsOils">Serums & Oils</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Product</label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="mt-1 bg-input border-border text-foreground">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {categoryProducts.map((product: any) => (
                            <SelectItem key={product.name} value={product.name}>
                              {product.name} (₦{product.price.toFixed(2)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground">Quantity</label>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 bg-input border-border text-foreground"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={addItem}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Items List */}
                  {items.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <h4 className="font-semibold text-foreground">Items ({items.length})</h4>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{item.productName}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} x ₦{item.unitPrice.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="font-semibold text-foreground w-20 text-right">₦{item.total.toFixed(2)}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div>
              <Card className="bg-card border border-border sticky top-20">
                <CardHeader>
                  <CardTitle>Invoice Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">₦{subtotal.toFixed(2)}</span>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Tax (%)</label>
                      <Input
                        type="number"
                        min="0"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        className="mt-1 bg-input border-border text-foreground"
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax Amount</span>
                      <span className="font-medium text-foreground">₦{taxAmount.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-xl font-bold text-primary">₦{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Save Invoice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
