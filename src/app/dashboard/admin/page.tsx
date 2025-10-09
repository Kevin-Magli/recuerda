"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseApp } from "@/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const app = useFirebaseApp();
  const functions = getFunctions(app);

  // Define the callable function, pointing to the 'makeAdmin' function deployed.
  const makeAdminCallable = httpsCallable(functions, 'makeAdmin');

  const handleMakeAdmin = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an email address.",
      });
      return;
    }
    setIsLoading(true);
    try {
      // The first admin must be set manually via gcloud CLI.
      // After that, they can use this page.
      const result = await makeAdminCallable({ email });
      console.log(result.data);
      toast({
        title: "Success!",
        description: `${email} has been made an admin.`,
      });
    } catch (error: any) {
      console.error("Function call error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not complete the request. Note: Only admins can perform this action.",
      });
    } finally {
      setIsLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, Admin! Manage users and site content here.
        </p>
      </div>

      <Card className="rounded-[30px] max-w-md">
        <CardHeader>
          <CardTitle>Promote User to Admin</CardTitle>
          <CardDescription>
            Enter the email address of the user you want to make an
            administrator. They will need to log out and log back in for the
            changes to take effect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label htmlFor="email">User Email</label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleMakeAdmin}
            disabled={isLoading}
            className="rounded-[30px]"
          >
            {isLoading ? "Promoting..." : "Make Admin"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="rounded-[30px] max-w-md bg-destructive/10 border-destructive/50">
        <CardHeader>
            <CardTitle>First Admin Setup</CardTitle>
            <CardDescription className="text-destructive-foreground/80">
                To promote the very first admin, you must use the gcloud command-line tool after deploying this function. This is a one-time security step.
            </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
            <p className="font-semibold">After deploying:</p>
            <ol className="list-decimal list-inside space-y-1 mt-2 text-destructive-foreground/80">
                <li>Install the gcloud CLI.</li>
                <li>Run `gcloud auth login`</li>
                <li>Run `gcloud projects list` to find your Project ID.</li>
                <li>Run `gcloud functions call makeAdmin --project=YOUR_PROJECT_ID --data='{"data":{"email":"your-email@example.com"}}'`</li>
            </ol>
        </CardContent>
      </Card>

    </div>
  );
}
