import { ReactNode } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminShell from "./AdminShell";

/**
 * Wraps admin pages with auth verification.
 * Shows loading state while checking, redirects to login if unauthorized.
 */
export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { loading, isAdmin, email } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6fa]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#1a6bff]/20 border-t-[#1a6bff]" />
          <p className="mt-4 text-sm text-[#5a6a7e]">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // useAdminAuth redirects automatically
  }

  return <AdminShell email={email || "admin"}>{children}</AdminShell>;
}
