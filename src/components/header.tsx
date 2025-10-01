'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/memorials', label: 'Memorials' },
  { href: '/#features', label: 'Features' },
  { href: '/#pricing', label: 'Pricing' },
];

export function Header() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavMenu = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center gap-6 text-sm font-medium text-muted-foreground", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="transition-colors hover:text-foreground"
          onClick={() => setIsMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] bg-background">
                <div className="p-4">
                  <div className="mb-8 flex justify-between">
                     <Logo />
                  </div>
                  <div className="flex flex-col items-start gap-6">
                    <NavMenu className="flex-col items-start gap-4 text-lg" />
                     <div className="mt-4 flex w-full flex-col gap-2 border-t pt-6">
                        <Button variant="outline" asChild className='w-full'>
                            <Link href="/login">Log In</Link>
                        </Button>
                        <Button asChild className='w-full'>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                     </div>
                  </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <div className="ml-10 hidden md:flex">
          <NavMenu />
        </div>
        <div className="ml-auto flex items-center gap-2">
           <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-[30px]" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
