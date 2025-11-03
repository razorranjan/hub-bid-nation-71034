import { Home, Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface HeaderProps {
  scrolled?: boolean;
}

export const Header = ({ scrolled = false }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 gap-2">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/listings?status=Live" className="text-lg font-medium hover:text-primary transition-colors">
                  Live Auctions
                </Link>
                <Link href="/listings?status=Upcoming" className="text-lg font-medium hover:text-primary transition-colors">
                  Upcoming
                </Link>
                <Link href="/profile" className="text-lg font-medium hover:text-primary transition-colors">
                  My Profile
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          {!scrolled && (
            <Link href="/" className="flex items-center gap-1 font-bold text-base">
              <span className="text-foreground">Auction Hub</span>
            </Link>
          )}
        </div>

        {scrolled ? (
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search city, locality, projects..." 
                className="pl-9 h-9"
              />
            </div>
          </div>
        ) : (
          <Link href="/profile" className="ml-auto">
            <Button variant="default" size="sm" className="h-8 text-xs px-3">
              Your Auctions
            </Button>
          </Link>
        )}

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                RN
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
