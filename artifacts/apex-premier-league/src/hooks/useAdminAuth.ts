import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createClient } from "@/lib/supabase/client";

type AdminAuthState = {
  loading: boolean;
  isAdmin: boolean;
  email: string | null;
};

/**
 * Hook to verify admin authentication.
 * Checks Supabase session, then verifies admin privileges via the admin API.
 * Redirects to /admin/login if not authenticated or not an admin.
 */
export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    isAdmin: false,
    email: null,
  });
  const [, navigate] = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          if (!cancelled) navigate("/admin/login");
          return;
        }

        // Verify admin access by hitting the admin stats endpoint
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.status === 401 || res.status === 403) {
          if (!cancelled) navigate("/admin/login");
          return;
        }

        if (!cancelled) {
          setState({
            loading: false,
            isAdmin: res.ok,
            email: session.user?.email || null,
          });
        }
      } catch {
        if (!cancelled) navigate("/admin/login");
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return state;
}
