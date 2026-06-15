import { createServiceClient } from "@/lib/supabase/service";

export async function logAdminAction(params: {
  adminEmail: string;
  action: string;
  entityType: "player" | "franchise";
  entityId: string;
  details?: string;
}) {
  try {
    const service = createServiceClient();
    await service.from("admin_audit_log").insert({
      admin_email: params.adminEmail,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      details: params.details || null
    });
  } catch {
    /* Table may not exist yet — non-blocking */
  }
}
