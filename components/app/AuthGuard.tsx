"use client";

import { firebaseAuth } from "@/auth";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/auth/sign-in",
  allowedRoles = [],
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      try {
        if (user) {
          // Get the user's ID token result to check custom claims (roles)
          const idTokenResult = await user.getIdTokenResult();
          const roles = (idTokenResult.claims.roles as string[]) || [];

          // If roles are specified and user doesn't have required role, redirect
          if (
            allowedRoles.length > 0 &&
            !allowedRoles.some((role) => roles.includes(role))
          ) {
            router.push("/auth/sign-in");
            return;
          }
        }

        setUser(user);
        setLoading(false);

        // Handle authentication redirects
        if (requireAuth && !user) {
          // Store the attempted URL for post-login redirect
          sessionStorage.setItem("redirectAfterLogin", pathname);
          router.push(redirectTo);
        } else if (!requireAuth && user) {
          // Redirect authenticated users away from auth pages
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Auth Guard Error:", error);
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [requireAuth, redirectTo, router, pathname, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Show children only if authentication requirements are met
  if (requireAuth && !user) {
    return null;
  }

  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
}
