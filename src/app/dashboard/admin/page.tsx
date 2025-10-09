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

// We will define this function in a new file
const makeAdminCallable = httpsCallable(getFunctions(useFirebaseApp()), 'makeAdmin');

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      const result = await makeAdminCallable({ email });
      console.log(result);
      toast({
        title: "Success!",
        description: `${email} has been made an admin.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not complete the request.",
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
    </div>
  );
}
