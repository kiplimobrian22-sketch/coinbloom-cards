import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, CreditCard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Verify", href: "/verify" },
    { name: "Buy", href: "/buy" },
    { name: "Sell", href: "/sell" },
    { name: "Balance Check", href: "/check-gift-card-balance" },
    { name: "Reviews", href: "/reviews" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="flex items-center space-x-2.5 animate-fade-in">
            <div className="p-2 rounded-xl bg-primary">
              <CreditCard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              All Giftcards
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
              {location.pathname === item.href && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow animate-fade-in" />
              )}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
          {loading ? (
            <div className="animate-pulse bg-muted rounded-md h-10 w-24"></div>
          ) : user ? (
            <>
              <div className="text-sm text-muted-foreground">
                Balance: <span className="font-semibold text-primary">$0.00</span>
              </div>
              <Button asChild className="btn-hero">
                <Link to="/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild className="btn-hero">
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border animate-slide-up">
          <div className="px-6 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block text-base font-medium transition-colors",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {loading ? (
              <div className="animate-pulse bg-muted rounded-md h-10 w-full"></div>
            ) : user ? (
              <>
                <div className="text-sm text-muted-foreground text-center mb-2">
                  Balance: <span className="font-semibold text-primary">$0.00</span>
                </div>
                <Button asChild className="btn-hero w-full">
                  <Link to="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild className="btn-hero w-full mt-4">
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;