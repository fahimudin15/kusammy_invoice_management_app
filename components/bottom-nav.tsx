"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Users, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/invoices", icon: FileText, label: "Invoices" },
        { href: "/clients", icon: Users, label: "Clients" },
    ]

    return (
        <nav className="bottom-nav">
            <div className="flex items-center justify-around py-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all duration-200",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    )
                })}

                {/* Center FAB */}
                <Link
                    href="/invoices/create"
                    className="flex flex-col items-center justify-center gap-1 -mt-8"
                >
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/50 flex items-center justify-center transition-all duration-300 active:scale-95 glow-orange">
                        <Plus className="h-6 w-6" strokeWidth={3} />
                    </div>
                    <span className="text-xs font-medium text-primary mt-1">New</span>
                </Link>
            </div>
        </nav>
    )
}
