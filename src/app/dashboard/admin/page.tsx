"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";


export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { firestore, isAdmin } = useFirebase();

  // This is a placeholder function now.
  // The actual logic will be to write to a 'roles_admin' collection
  // which will require new Firestore rules.
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
        description: "This functionality requires Cloud Functions, which are not available on the current plan.",
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
      
      {!isAdmin && (
         <Card className="rounded-[30px] max-w-md bg-destructive/10 border-destructive/50">
            <CardHeader>
                <CardTitle>Become the First Admin</CardTitle>
                <CardDescription className="text-destructive-foreground/80">
                   To get started, you need to claim the administrator role. This is a one-time action for the first user.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="rounded-[30px]">
                    <Link href="/claim-admin">Claim Admin Role</Link>
                </Button>
            </CardContent>
      </Card>
      )}

      <Card className="rounded-[30px] max-w-md">
        <CardHeader>
          <CardTitle>Promote User to Admin</CardTitle>
          <CardDescription>
            This feature is not available on the current free plan. To grant admin access to other users, you must manually add their user ID to the 'roles_admin' collection in your Firestore database.
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
