"use client"

import { useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { doc, updateDoc } from "firebase/firestore"

import { useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, PlusCircle, Trash2 } from "lucide-react"
import { Memorial } from "@/lib/definitions"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  lifeSpan: z.string().min(4, "Please enter a life span (e.g., 1950 - 2024)."),
  bio: z.string().optional(),
})

const EditPageSkeleton = () => (
    <div className="space-y-8">
        <div>
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="mt-2 h-4 w-3/4" />
        </div>
        <Card className="rounded-[30px] max-w-2xl">
            <CardHeader>
                <Skeleton className="h-7 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-24 rounded-[30px]" />
                    <Skeleton className="h-10 w-28 rounded-[30px]" />
                </div>
            </CardContent>
        </Card>
    </div>
);


export default function EditMemorialPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const firestore = useFirestore()
  const memorialId = params?.id as string

  const memorialRef = useMemoFirebase(
    () => (firestore && memorialId ? doc(firestore, "memorials", memorialId) : null),
    [firestore, memorialId]
  )

  const { data: memorial, isLoading, error } = useDoc<Memorial>(memorialRef)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lifeSpan: "",
      bio: "",
    },
  })

  useEffect(() => {
    if (memorial) {
      form.reset({
        name: memorial.name,
        lifeSpan: memorial.lifeSpan,
        bio: memorial.bio || "",
      })
    }
  }, [memorial, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !memorialId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find the necessary memorial information to update.",
      });
      return;
    }
    
    const docRef = doc(firestore, "memorials", memorialId);

    try {
      await updateDoc(docRef, values);
      toast({
        title: "Success!",
        description: "The memorial page has been updated.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error updating memorial:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not update the memorial page.",
      });
    }
  }

  if (isLoading || !memorial) {
    return <EditPageSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-semibold text-destructive">Error</h2>
        <p className="text-muted-foreground">Could not load memorial data.</p>
        <pre className="mt-2 text-xs bg-muted p-2 rounded-md">{error.message}</pre>
        <Button variant="outline" onClick={() => router.back()} className="mt-4 rounded-[30px]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
        </Button>
      </div>
    )
  }
  
  const currentImageCount = memorial.gallery?.length || 0;
  const maxImageCount = 10;


  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-2 pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold font-headline">Editing Memorial</h1>
        <p className="text-muted-foreground">
          You are currently editing the page for <span className="font-semibold text-foreground">{memorial.name}</span>.
        </p>
      </div>

      <Card className="rounded-[30px] max-w-2xl">
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
          <CardDescription>
            Make your changes below and save to update the public memorial page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lifeSpan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Life Span</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1950 - 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share a story about their life..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-[30px]">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-[30px] bg-gradient-to-br from-primary to-accent text-primary-foreground"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Gallery Management Card */}
      <Card className="rounded-[30px] max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Manage Gallery</CardTitle>
              <CardDescription>
                Add or remove photos from your memorial's gallery.
              </CardDescription>
            </div>
            <div className="text-right">
                <Button
                  className="rounded-[30px]"
                  disabled={currentImageCount >= maxImageCount}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Photos
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  You can add up to {maxImageCount} photos. ({currentImageCount}/{maxImageCount})
                </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {memorial.gallery && memorial.gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {memorial.gallery.map((image) => (
                    <div key={image.id} className="relative group aspect-square">
                        <Image
                            src={image.url}
                            alt="Gallery image"
                            fill
                            className="object-cover rounded-md"
                            data-ai-hint={image.hint}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                            <Button variant="destructive" size="icon" className="rounded-full h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete image</span>
                            </Button>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">The gallery is empty.</p>
                    <p className="text-sm text-muted-foreground">Click "Add Photos" to get started.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
