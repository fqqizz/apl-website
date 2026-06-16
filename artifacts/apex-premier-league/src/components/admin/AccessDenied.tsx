import { Link } from 'wouter';

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f6fa] px-4 text-center">
      <h1 className="text-2xl font-medium text-apl-navy">Access Denied</h1>
      <p className="mt-3 max-w-md text-sm text-apl-text-muted">
        Your signed-in email is not listed in the APL admins table, or admin lookup could not verify access. Ensure your
        Supabase Auth email matches the admins row exactly (case-insensitive). If you are an admin, confirm{" "}
        <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code> is set on the server.
      </p>
      <Link href="/" className="admin-btn-primary mt-8">
        Return to website
      </Link>
    </div>
  );
}
