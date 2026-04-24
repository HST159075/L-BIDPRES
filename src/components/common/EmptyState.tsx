import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?:       React.ReactNode;
  title:       string;
  description?: string;
  action?:     React.ReactNode;
  className?:  string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4", className)}>
      {icon && <div className="mb-4 opacity-30">{icon}</div>}
      <p className="font-semibold text-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
