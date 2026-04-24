import Link       from "next/link";
import { ROUTES } from "@/config/constants";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
      <div className="space-y-6">
        <h1 className="text-8xl font-black text-bid-500">404</h1>
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href={ROUTES.home}
          className="inline-flex items-center gap-2 px-6 py-3 bg-bid-500 hover:bg-bid-600 text-white font-semibold rounded-xl transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}
