"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MessageSquare, Send } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Memorial } from '@/lib/definitions';

const MemorialPageSkeleton = () => (
  <>
    <Header />
      <div className="bg-muted/30">
        <div className="relative h-[60vh] min-h-[400px] w-full bg-secondary">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="container -mt-10 relative z-30 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[30px] shadow-lg">
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="rounded-[30px] shadow-lg sticky top-24">
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="py-8"></div>
    </div>
    <Footer />
  </>
);


export default function MemorialPage() {
  const params = useParams();
  const memorialId = params?.id as string;
  const firestore = useFirestore();

  const memorialRef = useMemoFirebase(
    () => {
      if (firestore && memorialId) {
        return doc(firestore, 'memorials', memorialId);
      }
      return null;
    },
    [firestore, memorialId]
  );

  const { data: memorial, isLoading, error } = useDoc<Memorial>(memorialRef);

  if (isLoading) {
    return <MemorialPageSkeleton />;
  }

  if (!memorial) {
    return notFound();
  }

  return (
    <>
      <Header />
      <div className="bg-muted/30">
        <section className="relative h-[60vh] min-h-[400px] w-full text-white">
          {memorial.profileImage?.url && (
            <Image
                src={memorial.profileImage.url}
                alt={`A portrait of ${memorial.name}`}
                fill
                objectFit="cover"
                className="z-0"
                data-ai-hint={memorial.profileImage.hint}
                priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
          <div className="container relative z-20 flex h-full flex-col items-start justify-end pb-16">
            <h1 className="font-headline text-5xl font-bold drop-shadow-lg sm:text-6xl md:text-7xl">
              {memorial.name}
            </h1>
            <p className="mt-2 text-2xl font-light drop-shadow-md">{memorial.lifeSpan}</p>
          </div>
        </section>

        <div className="container -mt-10 relative z-30 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[30px] shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">{memorial.bio || 'No biography has been added yet.'}</p>
              </CardContent>
            </Card>

            <Card className="rounded-[30px] shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Gallery</CardTitle>
                <CardDescription>A collection of cherished moments.</CardDescription>
              </CardHeader>
              <CardContent>
                {memorial.gallery && memorial.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {memorial.gallery.map((image) => (
                        <div key={image.id} className="relative aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
                        <Image
                            src={image.url}
                            alt="Gallery image"
                            fill
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-110"
                            data-ai-hint={image.hint}
                        />
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-muted-foreground py-8">The gallery is empty.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="rounded-[30px] shadow-lg sticky top-24">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline text-2xl">Tributes</CardTitle>
                </div>
                <CardDescription>Share a memory or leave a message of support.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <Input placeholder="Your Name" className="rounded-xl" />
                  <Textarea placeholder="Share your tribute..." className="min-h-[100px] rounded-xl" />
                  <Button className="w-full rounded-[30px] bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Send className="mr-2 h-4 w-4" />
                    Post Tribute
                  </Button>
                </form>
                <Separator className="my-6" />
                <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                  {memorial.tributes && memorial.tributes.length > 0 ? memorial.tributes.map((tribute) => (
                    <div key={tribute.id} className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{tribute.author}</p>
                        <p className="text-xs text-muted-foreground">{tribute.date}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{tribute.message}</p>
                    </div>
                  )) : (
                    <p className="text-center text-sm text-muted-foreground">Be the first to leave a tribute.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="py-8"></div>
      </div>
      <Footer />
    </>
  );
}
