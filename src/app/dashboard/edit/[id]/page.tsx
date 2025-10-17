"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"

import { useFirestore, useDoc, useMemoFirebase, useUser } from "@/firebase"
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
import { Loader2, ArrowLeft, PlusCircle, Trash2, Upload } from "lucide-react"
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
            </CardContent>
        </Card>
    </div>
);


export default function EditMemorialPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const firestore = useFirestore()
  const { user } = useUser()
  const memorialId = params?.id as string

  const [isUploading, setIsUploading] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

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
      // Security check: Ensure the current user is the author of the memorial
      if (user && memorial.authorId !== user.uid) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have permission to edit this memorial.",
        });
        router.push("/dashboard");
        return;
      }
      form.reset({
        name: memorial.name,
        lifeSpan: memorial.lifeSpan,
        bio: memorial.bio || "",
      })
    }
  }, [memorial, user, router, toast, form])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'gallery') => {
    const file = event.target.files?.[0];
    if (!file || !memorialId || !memorialRef) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/upload?memorialId=${memorialId}&type=${type}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (type === 'profile') {
        await updateDoc(memorialRef, {
          profileImage: {
            url: result.url,
            hint: "custom image"
          }
        });
      } else {
        const newImage = {
          id: file.name + Date.now(), // Create a pseudo-unique ID
          url: result.url,
          hint: "custom image"
        };
        await updateDoc(memorialRef, {
          gallery: arrayUnion(newImage)
        });
      }

      toast({
        title: "Upload Successful",
        description: `Your image has been added.`,
      });

    } catch (err: any) {
      console.error('Upload Error:', err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err.message || "Could not upload the file.",
      });
    } finally {
      setIsUploading(false);
      if(event.target) event.target.value = '';
    }
  };

  const handleDeleteImage = async (imageToRemove: { id: string; url: string; hint: string }) => {
    if (!memorialRef) return;
    try {
      await updateDoc(memorialRef, {
        gallery: arrayRemove(imageToRemove)
      });
      toast({
        title: "Image Removed",
        description: "The image has been removed from the gallery.",
      });
    } catch (err: any) {
      console.error('Delete Error:', err);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: err.message || "Could not remove the image.",
      });
    }
  };


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

  if (isLoading || !user || !memorial) {
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
      <input 
        type="file" 
        ref={profileFileInputRef} 
        onChange={(e) => handleFileUpload(e, 'profile')}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
      />
      <input 
        type="file" 
        ref={galleryFileInputRef} 
        onChange={(e) => handleFileUpload(e, 'gallery')}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
      />

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
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            This is the main image that appears at the top of the memorial page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-48 h-48 rounded-lg overflow-hidden group">
            {memorial.profileImage?.url && (
              <Image 
                src={memorial.profileImage.url} 
                alt="Profile image"
                fill
                className="object-cover"
                data-ai-hint={memorial.profileImage.hint}
                key={memorial.profileImage.url} 
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => profileFileInputRef.current?.click()}
                  disabled={isUploading}
                >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {isUploading ? 'Uploading...' : 'Change'}
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-[30px] max-w-2xl">
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
          <CardDescription>
            Make your changes below and save to update the public memorial page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="memorial-edit-form">
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
                  disabled={currentImageCount >= maxImageCount || isUploading}
                  onClick={() => galleryFileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  {isUploading ? 'Uploading...' : 'Add Photos'}
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
                            key={image.url}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                            <Button variant="destructive" size="icon" className="rounded-full h-8 w-8" onClick={() => handleDeleteImage(image)}>
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
      
      <div className="flex justify-end gap-2 mt-8">
        <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-[30px]">
          Cancel
        </Button>
        <Button
          type="submit"
          form="memorial-edit-form"
          className="rounded-[30px] bg-gradient-to-br from-primary to-accent text-primary-foreground"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )

    