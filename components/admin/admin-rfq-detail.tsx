"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AdminRfqRecord, AdminRfqStatus } from "@/types";

const adminTextareaClassName =
  "w-full rounded-[1.5rem] border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/34 focus:border-white/24 focus:bg-white/[0.06]";

function formatStatusLabel(status: AdminRfqStatus) {
  switch (status) {
    case "reviewing":
      return "Contacted / Reviewing";
    case "quoted":
      return "Quoted";
    case "won":
      return "Closed - Won";
    case "lost":
      return "Closed - Lost";
    case "new":
    default:
      return "New";
  }
}

function formatDateLabel(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function NoticeBanner({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "success" | "error";
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-4 text-[14px] leading-[22.75px]",
        tone === "success"
          ? "border-white/16 bg-white/[0.08] text-white"
          : "border-red-400/24 bg-red-500/10 text-red-200",
      )}
    >
      {children}
    </div>
  );
}

interface AdminRfqDetailProps {
  rfq: AdminRfqRecord;
}

export function AdminRfqDetail({ rfq }: AdminRfqDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AdminRfqStatus>(rfq.status);
  const [adminNotes, setAdminNotes] = useState(rfq.adminNotes);
  const [requestTone, setRequestTone] = useState<"success" | "error">("success");
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setRequestMessage(null);

    try {
      const response = await fetch(`/api/admin/rfqs/${rfq.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          adminNotes,
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to update the RFQ.");
      }

      setRequestTone("success");
      setRequestMessage("RFQ updated successfully.");
      router.refresh();
    } catch (error) {
      setRequestTone("error");
      setRequestMessage(error instanceof Error ? error.message : "Unable to update the RFQ.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {requestMessage ? <NoticeBanner tone={requestTone}>{requestMessage}</NoticeBanner> : null}

      <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="grid gap-5 border-b border-white/10 pb-6 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">RFQ Number</p>
            <p className="mt-3 text-sm leading-7 text-white">{rfq.requestNumber}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Created</p>
            <p className="mt-3 text-sm leading-7 text-white">{formatDateLabel(rfq.createdAt)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Status</p>
            <p className="mt-3 text-sm leading-7 text-white">{formatStatusLabel(rfq.status)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Source</p>
            <p className="mt-3 text-sm leading-7 text-white">{rfq.source || "website"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Company</p>
            <p className="mt-3 text-sm leading-7 text-white">{rfq.companyName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Contact</p>
            <p className="mt-3 text-sm leading-7 text-white">{rfq.contactName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Email</p>
            <p className="mt-3 text-sm leading-7 text-white">{rfq.email || "Not provided"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Phone</p>
            <p className="mt-3 text-sm leading-7 text-white">{rfq.phone || "Not provided"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Country</p>
            <p className="mt-3 text-sm leading-7 text-white">{rfq.country || "Not provided"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Project Type</p>
            <p className="mt-3 text-sm leading-7 text-white">{rfq.projectStage || "Not provided"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Quantity</p>
            <p className="mt-3 text-sm leading-7 text-white">
              {rfq.annualVolume || (rfq.items.length > 0 ? `${rfq.items.reduce((sum, item) => sum + item.requestedQty, 0)}` : "General inquiry")}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-[20px] border border-white/10 bg-black/30 p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Customer Message</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/72">
              {rfq.message || "No message provided."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[20px] border border-white/10 bg-black/30 p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">Admin Update</p>
            <div className="mt-5">
              <label htmlFor="rfq-status" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Status
              </label>
              <Select id="rfq-status" value={status} onChange={(event) => setStatus(event.target.value as AdminRfqStatus)} className="mt-3">
                <option value="new">New</option>
                <option value="reviewing">Contacted / Reviewing</option>
                <option value="quoted">Quoted</option>
                <option value="won">Closed - Won</option>
                <option value="lost">Closed - Lost</option>
              </Select>
            </div>

            <div className="mt-5">
              <label htmlFor="rfq-admin-notes" className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Notes
              </label>
              <textarea
                id="rfq-admin-notes"
                value={adminNotes}
                onChange={(event) => setAdminNotes(event.target.value)}
                className={`${adminTextareaClassName} mt-3 min-h-[180px]`}
                placeholder="Internal notes stored inside requirements.admin_notes."
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button type="submit" disabled={isSubmitting} className={buttonStyles({ size: "sm" })}>
                {isSubmitting ? "Saving..." : "Save RFQ"}
              </button>
              <Link href="/admin/rfqs" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                Back to RFQs
              </Link>
            </div>
          </form>
        </div>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">Selected Products</p>
          <h2 className="font-display text-[1.9rem] font-semibold leading-[1.08] text-white">
            Items
          </h2>
        </div>

        <div className="mt-6 divide-y divide-white/10 rounded-[20px] border border-white/10">
          {rfq.items.length > 0 ? (
            rfq.items.map((item) => (
              <article
                key={item.id}
                className="grid gap-5 px-5 py-4 md:grid-cols-[minmax(0,1.3fr)_8rem_minmax(0,1fr)] md:items-center"
              >
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">
                    {item.productName || item.productSlug || "Requested product"}
                  </h3>
                  {item.productSlug ? (
                    <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/42">
                      {item.productSlug}
                    </p>
                  ) : null}
                </div>
                <div className="text-sm text-white/68">Qty {item.requestedQty}</div>
                <div className="text-sm leading-7 text-white/62">{item.notes || "No item notes."}</div>
              </article>
            ))
          ) : (
            <div className="p-5 text-[14px] leading-[22.75px] text-white/48">
              This submission was sent as a general inquiry without selected products.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
