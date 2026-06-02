import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f6fa] px-4 text-center">
      <h1 className="text-2xl font-medium text-apl-navy">Access Denied</h1>
      <p className="mt-3 max-w-md text-sm text-apl-text-muted">Your account is not authorized for the APL admin dashboard.</p>
      <Link href="/" className="admin-btn-primary mt-8">
        Return to website
      </Link>
    </div>
  );
}
