"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

import { useFirestore, useUser } from "@/firebase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  lifeSpan: z.string().min(4, "Please enter a life span (e.g., 1950 - 2024)."),
})

export default function CreateMemorialPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  const firestore = useFirestore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lifeSpan: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a memorial.",
      })
      return
    }

    try {
      const memorialCollectionRef = collection(
        firestore,
        "memorials"
      )

      await addDoc(memorialCollectionRef, {
        authorId: user.uid,
        name: values.name,
        lifeSpan: values.lifeSpan,
        createdAt: serverTimestamp(),
        profileImage: {
          url: `https://picsum.photos/seed/${Math.random()}/600/400`,
          hint: "placeholder image",
        },
      })

      toast({
        title: "Success!",
        description: "The memorial page has been created.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating memorial: ", error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not create the memorial page. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Create a New Memorial</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new page for your loved one.
        </p>
      </div>

      <Card className="rounded-[30px] max-w-2xl">
        <CardHeader>
          <CardTitle>Memorial Details</CardTitle>
          <CardDescription>
            Start with the basic information. You can add more details later.
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
                  {form.formState.isSubmitting ? "Creating..." : "Create Memorial"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
