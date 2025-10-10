"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, Heart, Lock, Share2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Memorial } from '@/lib/definitions';

const features = [
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: 'Beautiful Memorials',
    description: 'Create a stunning, personalized page with photos, stories, and videos to honor your loved one.',
  },
  {
    icon: <Share2 className="h-8 w-8 text-primary" />,
    title: 'Easily Shareable',
    description: 'Share the memorial page with family and friends anywhere in the world with a simple link.',
  },
  {
    icon: <Lock className="h-8 w-8 text-primary" />,
    title: 'Private & Secure',
    description: 'Control the privacy of your memorial page, keeping it intimate or making it public.',
  },
];

const MemorialCardSkeleton = () => (
    <Card className="overflow-hidden rounded-[30px] h-full flex flex-col">
        <Skeleton className="h-64 w-full" />
        <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
        </CardHeader>
    </Card>
);

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');
  const firestore = useFirestore();
  
  const memorialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Query the top-level 'memorials' collection, ordered by creation and limited.
    return query(collection(firestore, 'memorials'), orderBy('createdAt', 'desc'), limit(8));
  }, [firestore]);

  const { data: memorials, isLoading } = useCollection<Memorial>(memorialsQuery);

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <section className="relative w-full py-24 md:py-32 lg:py-40">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Serene background"
              fill
              objectFit="cover"
              className="absolute inset-0 z-0 opacity-20"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="container relative z-10 text-center">
            <div className="mb-4">
              <span className="pill">Celebrate Life</span>
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              A Beautiful, Lasting <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Tribute</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Create a unique and heartfelt memorial page to honor the life and legacy of someone special. Preserve memories, share stories, and connect with loved ones.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" className="rounded-[30px] px-8 text-lg bg-gradient-to-br from-primary to-accent text-primary-foreground" asChild>
                <Link href="/signup">Create a Memorial</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-[30px] px-8 text-lg" asChild>
                <Link href="/memorials">View Memorials</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Remembered Always</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Browse through the memorials created by our community.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading ? (
                <>
                  <MemorialCardSkeleton />
                  <MemorialCardSkeleton />
                  <MemorialCardSkeleton />
                  <MemorialCardSkeleton />
                </>
              ): (
                memorials && memorials.map((memorial) => (
                  <Link href={`/memorials/${memorial.id}`} key={memorial.id}>
                    <Card className="overflow-hidden rounded-[30px] transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
                      <div className="relative h-64 w-full bg-secondary">
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
        </section>

        <section id="features" className="py-20 md:py-28">
          <div className="container">
            <div className="text-center">
              <span className="pill">Why Us?</span>
              <h2 className="mt-2 font-headline text-3xl font-bold tracking-tight sm:text-4xl">Designed for Remembrance</h2>
              <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
                We provide the tools to create a beautiful and respectful online memorial, focusing on simplicity, elegance, and emotional connection.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 font-headline text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="pricing" className="py-20 md:py-28 bg-card">
          <div className="container">
            <div className="text-center">
              <span className="pill">Pricing</span>
              <h2 className="mt-2 font-headline text-3xl font-bold tracking-tight sm:text-4xl">A Plan for Every Need</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Choose a plan that works for you. Our goal is to make this accessible for everyone.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              
              <Card className="rounded-[30px] flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-2xl">Free</CardTitle>
                  <CardDescription>A simple, beautiful memorial.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-center mb-6">$0 <span className="text-lg font-normal text-muted-foreground">/ forever</span></div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Up to 25 photos</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Public or private page</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Guestbook for tributes</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-auto rounded-[30px]">Get Started</Button>
                </CardContent>
              </Card>

              <Card className="rounded-[30px] border-primary border-2 flex flex-col relative">
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">Most Popular</div>
                  </div>
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-2xl">Subscriber</CardTitle>
                  <CardDescription>More features and customization.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-center mb-6">$49 <span className="text-lg font-normal text-muted-foreground">/ one-time</span></div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Everything in Free</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Unlimited photos & videos</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Custom page design</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> No advertisements</li>
                  </ul>
                  <Button className="w-full mt-auto rounded-[30px] bg-gradient-to-br from-primary to-accent text-primary-foreground">Choose Plan</Button>
                </CardContent>
              </Card>

              <Card className="rounded-[30px] flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-2xl">Funeral Home</CardTitle>
                  <CardDescription>For our professional partners.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-center mb-6">Partner</div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Bulk memorial creation</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Branded pages</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Dedicated support</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-auto rounded-[30px]">Contact Us</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Create a <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Lasting Memory</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of others in celebrating the lives of those who have passed on. It's simple, quick, and free to start.
            </p>
            <div className="mt-8">
              <Button size="lg" className="rounded-[30px] px-8 text-lg bg-gradient-to-br from-primary to-accent text-primary-foreground" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
