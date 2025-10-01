import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold text-foreground", className)}>
      <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
        <Leaf className="h-5 w-5" />
      </div>
      <span className="font-headline">Eternity Pages</span>
    </Link>
  );
}
