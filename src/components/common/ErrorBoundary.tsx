"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle }        from "lucide-react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; message: string; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 text-center p-8">
          <AlertTriangle className="w-12 h-12 text-destructive" />
          <div>
            <h3 className="font-semibold text-foreground">Something went wrong</h3>
            <p className="text-sm text-muted-foreground mt-1">{this.state.message}</p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="px-4 py-2 bg-bid-500 text-white rounded-lg text-sm font-medium hover:bg-bid-600 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
