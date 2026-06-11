import "server-only";

import { revalidatePath } from "next/cache";

import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { AdminRfqItemRecord, AdminRfqRecord, AdminRfqStatus } from "@/types";

const ADMIN_RFQ_SELECT = `
  id,
  request_number,
  company_name,
  contact_name,
  email,
  phone,
  country,
  project_stage,
  annual_volume,
  message,
  requirements,
  source,
  status,
  created_at,
  updated_at,
  rfq_items (
    id,
    product_id,
    requested_qty,
    notes,
    product_snapshot
  )
`;

export class AdminRfqMutationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AdminRfqMutationError";
    this.status = status;
  }
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRfqStatus(value: string): AdminRfqStatus | null {
  if (
    value === "new" ||
    value === "reviewing" ||
    value === "quoted" ||
    value === "won" ||
    value === "lost"
  ) {
    return value;
  }

  return null;
}

function normalizeRequirements(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function mapRfqItems(value: unknown): AdminRfqItemRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const item = entry as Record<string, unknown>;
      const snapshot =
        item.product_snapshot && typeof item.product_snapshot === "object" && !Array.isArray(item.product_snapshot)
          ? (item.product_snapshot as Record<string, unknown>)
          : {};

      return {
        id: normalizeString(item.id),
        productId: normalizeString(item.product_id ?? snapshot.product_id),
        productName: normalizeString(snapshot.product_name),
        productSlug: normalizeString(snapshot.product_slug),
        productImage: normalizeString(snapshot.product_image),
        requestedQty:
          typeof item.requested_qty === "number" && Number.isFinite(item.requested_qty)
            ? item.requested_qty
            : 0,
        notes: normalizeString(item.notes),
      } satisfies AdminRfqItemRecord;
    })
    .filter((item): item is AdminRfqItemRecord => Boolean(item));
}

function mapAdminRfqRow(row: Record<string, unknown>): AdminRfqRecord {
  const requirements = normalizeRequirements(row.requirements);

  return {
    id: normalizeString(row.id),
    requestNumber: normalizeString(row.request_number),
    companyName: normalizeString(row.company_name),
    contactName: normalizeString(row.contact_name),
    email: normalizeString(row.email),
    phone: normalizeString(row.phone),
    country: normalizeString(row.country),
    projectStage: normalizeString(row.project_stage),
    annualVolume: normalizeString(row.annual_volume),
    message: normalizeString(row.message),
    source: normalizeString(row.source),
    status: normalizeRfqStatus(normalizeString(row.status)) ?? "new",
    createdAt: normalizeString(row.created_at),
    updatedAt: normalizeString(row.updated_at),
    requirements,
    items: mapRfqItems(row.rfq_items),
    adminNotes: normalizeString(requirements.admin_notes),
  };
}

function revalidateAdminRfqPaths(rfqId?: string) {
  const paths = new Set<string>(["/admin", "/admin/rfqs"]);

  if (rfqId) {
    paths.add(`/admin/rfqs/${rfqId}`);
  }

  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function getAdminRfqs() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("rfq_requests")
    .select(ADMIN_RFQ_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load RFQ submissions: ${error.message}`);
  }

  return (data ?? []).map((row) => mapAdminRfqRow(row as Record<string, unknown>));
}

export async function getAdminRfqById(rfqId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("rfq_requests")
    .select(ADMIN_RFQ_SELECT)
    .eq("id", rfqId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load RFQ detail: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapAdminRfqRow(data as Record<string, unknown>);
}

export async function updateAdminRfq(
  rfqId: string,
  payload: {
    adminNotes: string;
    status: string;
  },
) {
  const supabase = createAdminSupabaseClient();
  const existing = await getAdminRfqById(rfqId);

  if (!existing) {
    throw new AdminRfqMutationError("This RFQ could not be found.", 404);
  }

  const status = normalizeRfqStatus(payload.status);

  if (!status) {
    throw new AdminRfqMutationError("Select a valid RFQ status.");
  }

  const requirements = {
    ...existing.requirements,
    admin_notes: payload.adminNotes.trim(),
  };

  const { error } = await supabase
    .from("rfq_requests")
    .update({
      status,
      requirements,
    })
    .eq("id", rfqId);

  if (error) {
    throw new AdminRfqMutationError(`Unable to update the RFQ: ${error.message}`, 503);
  }

  revalidateAdminRfqPaths(rfqId);

  return getAdminRfqById(rfqId);
}
