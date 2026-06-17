import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createClient } from "@/lib/supabase/client";
import AdminShell from "./AdminShell";

type AuthState = "loading" | "authenticated" | "unauthenticated";

/**
 * Wraps admin pages with auth verification.
 * Shows loading state while checking, redirects to login if unauthorized.
 */
export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>("loading");
  const [email, setEmail] = useState("");
  const [, navigate] = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const supabase = createClient();
        if (!supabase) {
          if (!cancelled) navigate("/admin/login");
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
          if (!cancelled) {
            setState("unauthenticated");
            navigate("/admin/login");
          }
          return;
        }

        if (!cancelled) {
          setEmail(session.user?.email || "admin");
          setState("authenticated");
        }
      } catch {
        if (!cancelled) {
          setState("unauthenticated");
          navigate("/admin/login");
        }
      }
    }

    check();
    return () => { cancelled = true; };
  }, [navigate]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6fa]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#1a6bff]/20 border-t-[#1a6bff]" />
          <p className="mt-4 text-sm text-[#5a6a7e]">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (state !== "authenticated") {
    // Show brief redirect message while wouter navigates
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6fa]">
        <div className="text-center">
          <p className="text-sm text-[#5a6a7e]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <AdminShell email={email}>{children}</AdminShell>;
}
