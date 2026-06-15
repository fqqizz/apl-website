import { requireAdmin } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    if (auth.reason === "forbidden") return <AccessDenied />;
    return null;
  }

  return <AdminShell email={auth.user.email || ""}>{children}</AdminShell>;
}
