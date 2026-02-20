"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthRedirect({ children, to = "/" }) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (isReady && isAuthenticated) router.replace(to);
  }, [isReady, isAuthenticated, router, to]);

  if (!isReady) return null;
  if (isAuthenticated) return null;

  return children;
}