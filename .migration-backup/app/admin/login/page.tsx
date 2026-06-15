"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signError) {
      setError(signError.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  const forgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`
    });
    if (resetError) setError(resetError.message);
    else setResetSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#eef2f9] to-white px-4">
      <div className="admin-glass w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <Image src="/apl-logo.png" alt="APL" width={56} height={56} className="mx-auto h-14 w-auto" />
          <h1 className="mt-4 text-xl font-medium text-apl-navy">APL Admin</h1>
          <p className="mt-1 text-sm text-apl-text-muted">Sign in to manage registrations</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="admin-label">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="admin-field" />
          </label>
          <label className="block">
            <span className="admin-label">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="admin-field" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {resetSent && <p className="text-sm text-emerald-600">Password reset email sent.</p>}
          <button type="submit" disabled={loading} className="admin-btn-primary w-full justify-center">
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <button type="button" onClick={forgotPassword} className="w-full text-center text-sm text-apl-blue hover:underline">
            Forgot Password
          </button>
        </form>
        <Link href="/" className="mt-6 block text-center text-xs text-apl-text-muted hover:text-apl-navy">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
