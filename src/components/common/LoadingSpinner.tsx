import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?:      "sm" | "md" | "lg";
  className?: string;
  fullPage?:  boolean;
}

export function LoadingSpinner({ size = "md", className, fullPage }: LoadingSpinnerProps) {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-8 h-8 border-4", lg: "w-12 h-12 border-4" };

  const spinner = (
    <div className={cn(
      "rounded-full border-bid-500 border-t-transparent animate-spin",
      sizes[size], className
    )} />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
