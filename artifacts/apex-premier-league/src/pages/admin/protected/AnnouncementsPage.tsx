

import { useEffect, useState, FormEvent } from "react";
import { Megaphone, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminAnnouncementsPage() {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/announcement")
      .then((r) => r.json())
      .then((data) => {
        if (data.announcement) {
          setText(data.announcement.text);
          setIsActive(data.announcement.is_active);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await adminFetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, is_active: isActive })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update announcement.");
      } else {
        setMessage("Announcement updated successfully.");
      }
    } catch {
      setError("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-apl-text-muted">Loading announcements...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-apl-navy">Announcement Bar</h1>
      <p className="mt-1 text-sm text-apl-text-muted">Manage the global alert bar displayed at the top of the website</p>

      {message && (
        <div className="mt-4 flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
          <p className="text-sm font-medium text-emerald-800">{message}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-6 admin-card">
        <div className="flex items-center gap-3 border-b border-black/5 pb-4">
          <Megaphone className="text-apl-blue" size={20} />
          <h2 className="text-sm font-semibold text-apl-navy">Edit Global Announcement</h2>
        </div>

        <div className="space-y-2">
          <label className="admin-label">Announcement Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={3}
            className="admin-field resize-none"
            placeholder="e.g. Season One registrations are now open."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-apl-blue focus:ring-apl-blue"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-apl-navy select-none cursor-pointer">
            Active (Display on website header)
          </label>
        </div>

        <div className="flex justify-end pt-2 border-t border-black/5">
          <button type="submit" disabled={saving} className="admin-btn-primary">
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
