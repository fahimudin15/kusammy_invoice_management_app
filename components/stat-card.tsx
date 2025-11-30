import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: string
        isPositive: boolean
    }
    className?: string
    iconColor?: string
}

export function StatCard({ title, value, icon: Icon, trend, className, iconColor = "text-primary" }: StatCardProps) {
    return (
        <div className={cn("stat-card group", className)}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">{value}</h3>
                </div>
                <div className={cn("p-3 rounded-xl bg-secondary transition-all duration-300 group-hover:scale-110", iconColor)}>
                    <Icon className="h-6 w-6 md:h-7 md:w-7" />
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-1 text-sm">
                    <span className={cn("font-semibold", trend.isPositive ? "text-accent" : "text-destructive")}>
                        {trend.isPositive ? "↗" : "↘"} {trend.value}
                    </span>
                    <span className="text-muted-foreground">vs yesterday</span>
                </div>
            )}
        </div>
    )
}
