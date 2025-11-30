import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
    message?: string
    size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ message = "Please wait...", size = "md" }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
            {message && <p className="text-sm font-medium text-muted-foreground">{message}</p>}
        </div>
    )
}
