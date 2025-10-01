import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("font-bold", className)}>
      <span className="font-headline text-2xl bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
        Recuerda
      </span>
    </Link>
  );
}
