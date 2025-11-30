"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

export default function Settings() {
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [companyPhone, setCompanyPhone] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("companyInfo")
    if (stored) {
      const info = JSON.parse(stored)
      setCompanyName(info.name || "")
      setCompanyAddress(info.address || "")
      setCompanyPhone(info.phone || "")
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem(
      "companyInfo",
      JSON.stringify({
        name: companyName,
        address: companyAddress,
        phone: companyPhone,
      }),
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your company information</p>
          </div>

          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>This information will appear on all your invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground">Company Name</label>
                <Input
                  placeholder="Your Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 bg-input border-border text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Address</label>
                <Textarea
                  placeholder="123 Main Street, City, State 12345"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="mt-1 bg-input border-border text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input
                  placeholder="+1 (555) 000-0000"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="mt-1 bg-input border-border text-foreground"
                />
              </div>

              <div className="pt-4">
                <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                {saved && <p className="text-sm text-green-600 mt-2">Settings saved successfully!</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
