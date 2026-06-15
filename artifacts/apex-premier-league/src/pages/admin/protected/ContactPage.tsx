

import { useCallback, useEffect, useState } from "react";
import { Search, X, Check, Trash2, Mail, MailOpen } from "lucide-react";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/contact?${params}`);
    const data = await res.json();
    setSubmissions(data.submissions || []);
    setLoading(false);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const toggleRead = async (id: string, is_read: boolean) => {
    await fetch(`/api/admin/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read })
    });
    load();
    if (selected?.id === id) setSelected({ ...selected, is_read });
  };

  const deleteSubmission = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    await fetch(`/api/admin/contact/${id}`, {
      method: "DELETE"
    });
    setSelected(null);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-medium text-apl-navy">Contact Inquiries</h1>
      <p className="mt-1 text-sm text-apl-text-muted">User submissions from the website contact form</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-apl-text-muted" />
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="Search by name, email, subject, message content..." 
            className="admin-field !pl-10" 
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-apl-text-muted">
                  Loading...
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-apl-text-muted">
                  No submissions found
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id} className={s.is_read ? "opacity-60" : "font-semibold"}>
                  <td>
                    {s.is_read ? (
                      <span className="inline-flex items-center gap-1 text-xs text-apl-text-muted font-normal">
                        <MailOpen size={12} /> Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-apl-blue font-semibold">
                        <Mail size={12} /> New
                      </span>
                    )}
                  </td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td className="max-w-[200px] truncate">{s.subject}</td>
                  <td>
                    {new Date(s.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td>
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => setSelected(s)} 
                        className="text-xs text-apl-blue hover:underline"
                      >
                        View
                      </button>
                      <button 
                        type="button" 
                        onClick={() => toggleRead(s.id, !s.is_read)} 
                        className="text-xs text-apl-text-muted hover:text-apl-navy hover:underline"
                      >
                        {s.is_read ? "Unread" : "Read"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium">{selected.name}</h2>
                <p className="text-sm text-apl-blue">{selected.email}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            
            <dl className="mt-4 grid gap-2 text-sm border-t border-b border-black/5 py-4">
              <div className="flex justify-between">
                <dt className="text-apl-text-muted">Phone</dt>
                <dd>{selected.phone || "Not provided"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-apl-text-muted">Submitted Date</dt>
                <dd>
                  {new Date(selected.created_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                  })}
                </dd>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <dt className="text-apl-text-muted">Subject</dt>
                <dd className="font-medium">{selected.subject}</dd>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <dt className="text-apl-text-muted">Message</dt>
                <dd className="rounded-lg bg-[#f4f6fa] p-3 leading-relaxed whitespace-pre-wrap">{selected.message}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2 justify-between">
              <button 
                type="button" 
                onClick={() => toggleRead(selected.id, !selected.is_read)} 
                className="admin-btn-ghost !text-xs"
              >
                {selected.is_read ? "Mark as Unread" : "Mark as Read"}
              </button>
              <button 
                type="button" 
                onClick={() => deleteSubmission(selected.id)} 
                className="admin-btn-ghost !text-xs !border-red-200 !text-red-600 hover:!bg-red-50"
              >
                <Trash2 size={13} className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
