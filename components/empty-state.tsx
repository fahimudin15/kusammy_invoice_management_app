interface EmptyStateProps {
    emoji: string
    title: string
    description: string
    action?: React.ReactNode
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
    return (
        <div className="empty-state animate-slide-up">
            <div className="text-7xl mb-4">{emoji}</div>
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
            {action}
        </div>
    )
}
