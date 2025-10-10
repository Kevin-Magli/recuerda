"use client";

import Image from 'next/image';
import Link from 'next/link';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';

type Memorial = {
  id: string
  name: string
  lifeSpan: string
  profileImage?: {
    url: string
    hint: string
  }
};

const MemorialCardSkeleton = () => (
  <Card className="overflow-hidden rounded-[30px] h-full flex flex-col">
    <Skeleton className="h-72 w-full" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
  </Card>
);


export default function MemorialsPage() {
  const firestore = useFirestore();

  const memorialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'memorials');
  }, [firestore]);

  const { data: memorials, isLoading } = useCollection<Memorial>(memorialsQuery);

  return (
    <>
      <Header />
      <div className="bg-background">
        <div className="container py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="pill">Our Community's Tributes</span>
            <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              In Loving Memory
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Explore the beautiful memorials created by families and friends to honor and remember their loved ones.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
              <>
                <MemorialCardSkeleton />
                <MemorialCardSkeleton />
                <MemorialCardSkeleton />
                <MemorialCardSkeleton />
              </>
            ) : (
              memorials && memorials.map((memorial) => (
                <Link href={`/memorials/${memorial.id}`} key={memorial.id}>
                  <Card className="overflow-hidden rounded-[30px] transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
                    <div className="relative h-72 w-full bg-secondary">
                      {memorial.profileImage && (
                        <Image
                          src={memorial.profileImage.url}
                          alt={`A photo of ${memorial.name}`}
                          fill
                          objectFit="cover"
                          data-ai-hint={memorial.profileImage.hint}
                        />
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="font-headline text-xl">{memorial.name}</CardTitle>
                      <CardDescription>{memorial.lifeSpan}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
