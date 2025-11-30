import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    name: string
    price: number
    image?: string
    onAdd: () => void
    className?: string
}

export function ProductCard({ name, price, image, onAdd, className }: ProductCardProps) {
    return (
        <div className={cn("product-card group", className)}>
            {/* Product Image */}
            <div className="relative mb-3 aspect-square rounded-lg bg-secondary overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl">🧴</div>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="mb-3">
                <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 leading-tight">{name}</h4>
                <p className="text-lg font-bold text-primary">₦{price.toLocaleString()}</p>
            </div>

            {/* Add Button */}
            <button
                onClick={onAdd}
                className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary-hover hover:scale-105 active:scale-95 glow-orange"
            >
                <Plus className="h-4 w-4" />
                Add
            </button>
        </div>
    )
}
