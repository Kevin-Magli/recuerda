import Image from "next/image"
import Link from "next/link"
import { PlusCircle, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { memorials } from "@/lib/data"

export default function DashboardPage() {
  const userMemorials = memorials.slice(0, 3) // Placeholder for user's memorials

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Memorials</h1>
          <p className="text-muted-foreground">
            Manage and create new memorial pages.
          </p>
        </div>
        <Button className="rounded-[30px] bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Memorial
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {userMemorials.map((memorial) => (
          <Card key={memorial.id} className="rounded-[30px] overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={memorial.profileImage.url}
                  alt={memorial.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={memorial.profileImage.hint}
                />
              </div>
              <div className="p-6">
                <CardTitle className="font-headline text-xl">{memorial.name}</CardTitle>
                <CardDescription>{memorial.lifeSpan}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="bg-muted/50 p-3 flex gap-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/memorials/${memorial.slug}`} target="_blank">
                  View Page
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        <div className="flex items-center justify-center rounded-[30px] border-2 border-dashed p-6">
          <Button variant="outline" className="w-full h-full flex-col gap-2">
            <PlusCircle className="h-8 w-8 text-muted-foreground" />
            <span className="text-muted-foreground">Create a new memorial</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
