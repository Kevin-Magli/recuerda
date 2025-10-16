"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react"
import { collection, query, where, doc, deleteDoc } from "firebase/firestore"

import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Memorial } from "@/lib/definitions"

const MemorialSkeleton = () => (
  <Card className="rounded-[30px] overflow-hidden">
    <CardHeader className="p-0">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardHeader>
    <CardFooter className="bg-muted/50 p-3 flex gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </CardFooter>
  </Card>
);

export default function DashboardPage() {
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [memorialToDelete, setMemorialToDelete] = useState<Memorial | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Query the top-level 'memorials' collection, filtering by authorId
  const memorialsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return query(collection(firestore, "memorials"), where("authorId", "==", user.uid));
  }, [firestore, user])

  const { data: userMemorials, isLoading } = useCollection<Memorial>(memorialsQuery);

  const showLoading = isUserLoading || isLoading;

  const openDeleteDialog = (memorial: Memorial) => {
    setMemorialToDelete(memorial)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteMemorial = async () => {
    if (!memorialToDelete || !firestore) return;

    setIsDeleting(true);
    try {
      const memorialRef = doc(firestore, "memorials", memorialToDelete.id);
      await deleteDoc(memorialRef);
      toast({
        title: "Memorial Deleted",
        description: `The memorial for ${memorialToDelete.name} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting memorial: ", error);
      toast({
        variant: "destructive",
        title: "Error Deleting",
        description: "Could not delete the memorial. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setMemorialToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">My Memorials</h1>
            <p className="text-muted-foreground">
              Manage and create new memorial pages.
            </p>
          </div>
          <Button asChild className="rounded-[30px] bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Link href="/dashboard/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Memorial
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showLoading ? (
            <>
              <MemorialSkeleton />
              <MemorialSkeleton />
              <MemorialSkeleton />
            </>
          ) : (
            <>
              {userMemorials && userMemorials.map((memorial) => (
                <Card key={memorial.id} className="rounded-[30px] overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full bg-secondary">
                      {memorial.profileImage?.url && (
                        <Image
                          src={memorial.profileImage.url}
                          alt={memorial.name}
                          fill
                          objectFit="cover"
                          data-ai-hint={memorial.profileImage.hint}
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <CardTitle className="font-headline text-xl">{memorial.name}</CardTitle>
                      <CardDescription>{memorial.lifeSpan}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="bg-muted/50 p-3 flex gap-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/memorials/${memorial.id}`} target="_blank">
                        View Page
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/edit/${memorial.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(memorial)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Link href="/dashboard/create" className="flex items-center justify-center rounded-[30px] border-2 border-dashed p-6 hover:bg-muted/50 transition-colors">
                <div className="text-center">
                  <PlusCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <span className="text-muted-foreground">Create a new memorial</span>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this memorial?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the memorial page for <span className="font-semibold">{memorialToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMemorial} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
