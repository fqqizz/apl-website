const getBaseUrl = () => {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  return domain ? `https://${domain}` : "http://localhost:8080";
};

export interface AplStats {
  players: number;
  franchises: number;
  season: number;
}

export interface AnnouncementItem {
  text: string;
  is_active: boolean;
}

export interface AnnouncementResponse {
  announcement: AnnouncementItem | null;
}

export interface StatusResponse {
  player_id: string;
  application_status: string;
  created_at: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PaymentCreateData {
  name: string;
  email: string;
  phone: string;
}

export interface PaymentCreateResponse {
  orderId: string;
  payment_link?: string;
  paymentLink?: string;
  payment_session_id?: string;
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error((err as { error?: string }).error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

export const aplApi = {
  getStats: () => apiRequest<AplStats>("/api/apl/stats"),
  getAnnouncement: () => apiRequest<AnnouncementResponse>("/api/apl/announcement"),
  getStatus: (playerId: string) =>
    apiRequest<StatusResponse>(`/api/apl/status?player_id=${encodeURIComponent(playerId)}`),
  submitContact: (data: ContactData) =>
    apiRequest<{ success: boolean }>("/api/apl/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  sendApexAI: (messages: AiMessage[]) =>
    apiRequest<{ reply: string }>("/api/apl/apex-ai", {
      method: "POST",
      body: JSON.stringify({ messages }),
    }),
  createPaymentOrder: (data: PaymentCreateData) =>
    apiRequest<PaymentCreateResponse>("/api/apl/payments/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
