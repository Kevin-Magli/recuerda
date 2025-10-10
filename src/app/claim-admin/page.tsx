"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function ClaimAdminPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const handleClaimAdmin = () => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to perform this action.",
      });
      return;
    }

    const adminRoleRef = doc(firestore, "roles_admin", user.uid);
    const roleData = { grantedAt: new Date().toISOString() };

    // This is now a non-blocking call.
    // The error will be caught and emitted by setDocumentNonBlocking.
    setDocumentNonBlocking(adminRoleRef, roleData, {});
    
    toast({
      title: "Processing...",
      description: "Your request to claim the admin role is being processed. You will be redirected shortly.",
    });

    // Redirect optimistically. The auth listener will handle the new role.
    router.push("/dashboard/admin");
  };

  if (isUserLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
      router.push("/login");
      return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md rounded-[30px]">
        <CardHeader>
          <CardTitle>Claim Administrator Role</CardTitle>
          <CardDescription>
            Click the button below to become the first administrator for this
            application. This action can only be performed once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClaimAdmin} className="w-full rounded-[30px]">
            Become First Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
