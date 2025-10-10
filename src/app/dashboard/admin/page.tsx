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
import { useFirebase } from "@/firebase";

export default function AdminPage() {
  const [email, setEmail] = useState("");
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
    toast({
      variant: "destructive",
      title: "Not Implemented",
      description: "This functionality is not available on the current plan.",
    });
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
            To grant admin access to other users, you must manually add their user ID to the 'roles_admin' collection in your Firestore database.
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
              disabled={true}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleMakeAdmin}
            disabled={true}
            className="rounded-[30px]"
          >
            Make Admin
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
