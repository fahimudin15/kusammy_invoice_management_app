"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { BottomNav } from "@/components/bottom-nav"
import { Users, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { invoiceService } from "@/lib/invoice-service"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ClientsPage() {
    const [clients, setClients] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login")
            return
        }

        if (user) {
            loadClients()
        }
    }, [user, authLoading, router])

    const loadClients = async () => {
        setLoading(true)

        const { data, error } = await invoiceService.getInvoices()

        if (error) {
            console.error("Error loading clients:", error)
            setLoading(false)
            return
        }

        if (data) {
            // Extract unique customer names
            const uniqueClients = Array.from(new Set(data.map(inv => inv.customer_name)))
                .filter(name => name && name.trim() !== "")
                .sort()

            setClients(uniqueClients)
        }
        setLoading(false)
    }

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

    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-background breathing-space pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 md:mb-12 animate-slide-up">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                                Clients
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            {clients.length} {clients.length === 1 ? 'customer' : 'customers'} in total
                        </p>
                    </div>

                    {/* Clients List */}
                    <Card className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 md:px-8 py-6 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">All Customers</h2>
                                    <p className="text-sm text-muted-foreground">Your customer list</p>
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
                            {clients.length === 0 ? (
                                <EmptyState
                                    emoji="👥"
                                    title="No clients yet"
                                    description="Start creating invoices to build your customer list!"
                                    action={
                                        <Link href="/invoices/create">
                                            <Button className="bg-primary text-primary-foreground hover:bg-primary-hover gap-2 glow-orange font-semibold px-8 py-6 text-base rounded-xl">
                                                <Plus className="h-5 w-5" />
                                                Create first invoice
                                            </Button>
                                        </Link>
                                    }
                                />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                    {clients.map((clientName, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-xl bg-secondary/50 border border-border hover:bg-secondary hover:shadow-md transition-all duration-200 cursor-pointer group"
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                    {clientName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                                        {clientName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">Customer</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
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
