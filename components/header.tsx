"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSubscription } from "@/hooks/use-subscription";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useSubscription();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-background via-primary/80 to-background rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                TL
              </span>
            </div>
            <span className="font-bold text-xl text-foreground">TrendLens</span>
            <Badge variant="secondary" className="text-xs">
              AI-Powered
            </Badge>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </a>
          <a
            href="#radar"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Radar
          </a>
          <a
            href="#lifecycle"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Lifecycle
          </a>
          <a
            href="#insights"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Insights
          </a>
          <a
            href="#demo"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Demo
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="pulse-glow bg-gradient-to-br from-background via-primary/80 to-background"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
