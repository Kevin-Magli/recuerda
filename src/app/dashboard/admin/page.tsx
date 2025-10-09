import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, Admin! Manage users and site content here.
        </p>
      </div>

      <Card className="rounded-[30px]">
        <CardHeader>
          <CardTitle>Admin Features</CardTitle>
          <CardDescription>
            This is where the admin-specific components and management tools will go.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
