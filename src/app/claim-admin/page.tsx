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
import { doc, setDoc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function ClaimAdminPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const handleClaimAdmin = async () => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to perform this action.",
      });
      return;
    }

    const adminRoleRef = doc(firestore, "roles_admin", user.uid);

    try {
      // We are not awaiting this. We navigate away and let it process.
      // The `onIdTokenChanged` listener in the provider will automatically
      // pick up the new "isAdmin" claim when the user's token refreshes.
      await setDoc(adminRoleRef, { grantedAt: new Date() });
      
      toast({
        title: "Success!",
        description: "You have claimed the administrator role. Please allow a moment for permissions to update.",
      });

      // Redirect to the admin dashboard. The `useUser` hook will update with the new role.
      router.push("/dashboard/admin");

    } catch (error: any) {
        console.error("Failed to claim admin role:", error);
         toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not claim admin role. It's possible another user has already claimed it. Check Firestore rules if the issue persists.",
      });
    }
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
