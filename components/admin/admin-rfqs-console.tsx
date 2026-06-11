"use client";

import Link from "next/link";
import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AdminRfqRecord, AdminRfqStatus } from "@/types";

interface AdminRfqsConsoleProps {
  rfqs: AdminRfqRecord[];
}

type StatusFilter = "all" | AdminRfqStatus;

function formatDateLabel(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getQuantityLabel(rfq: AdminRfqRecord) {
  if (rfq.annualVolume) {
    return rfq.annualVolume;
  }

  const itemTotal = rfq.items.reduce((total, item) => total + item.requestedQty, 0);

  if (itemTotal > 0) {
    return `${itemTotal}`;
  }

  return "General inquiry";
}

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

function statusBadgeClass(status: AdminRfqStatus) {
  if (status === "new") {
    return "border-white/16 bg-white/[0.08] text-white";
  }

  if (status === "quoted") {
    return "border-cyan-200/24 bg-cyan-400/10 text-cyan-100";
  }

  if (status === "won") {
    return "border-emerald-300/24 bg-emerald-500/10 text-emerald-100";
  }

  if (status === "lost") {
    return "border-red-400/24 bg-red-500/10 text-red-200";
  }

  return "border-amber-300/24 bg-amber-500/10 text-amber-100";
}

export function AdminRfqsConsole({ rfqs }: AdminRfqsConsoleProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredRfqs = rfqs.filter((rfq) => {
    const matchesQuery =
      query.trim().length === 0 ||
      [
        rfq.requestNumber,
        rfq.companyName,
        rfq.contactName,
        rfq.email,
        rfq.country,
        rfq.projectStage,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const newCount = rfqs.filter((rfq) => rfq.status === "new").length;

  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/42">RFQ Pipeline</p>
            <h2 className="mt-2 font-display text-[1.9rem] font-semibold leading-[1.08] text-white">RFQs</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62">
              Review incoming quote requests, open the full submission record, and update the real schema-backed RFQ status values.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search RFQ, company, contact, email, or country"
            />

            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="reviewing">Contacted / Reviewing</option>
              <option value="quoted">Quoted</option>
              <option value="won">Closed - Won</option>
              <option value="lost">Closed - Lost</option>
            </Select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">Submissions</p>
            <p className="mt-3 font-display text-2xl font-semibold text-white">{rfqs.length}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">New</p>
            <p className="mt-3 font-display text-2xl font-semibold text-white">{newCount}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">General Inquiries</p>
            <p className="mt-3 font-display text-2xl font-semibold text-white">
              {rfqs.filter((rfq) => rfq.items.length === 0).length}
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/10 rounded-[20px] border border-white/10">
          {filteredRfqs.length > 0 ? (
            filteredRfqs.map((rfq) => (
              <article
                key={rfq.id}
                className="grid gap-5 px-5 py-4 md:grid-cols-[minmax(0,1.4fr)_10rem_10rem_12rem_auto] md:items-center"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">{rfq.requestNumber}</p>
                  <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-[1.08] text-white">
                    {rfq.companyName || "Company not provided"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/56">
                    {rfq.contactName || "Unknown contact"} · {rfq.email || "No email"} · {rfq.country || "No country"}
                  </p>
                </div>

                <div className="text-[11px] uppercase tracking-[0.22em] text-white/52">
                  {rfq.projectStage || "No project type"}
                </div>

                <div className="text-[11px] uppercase tracking-[0.22em] text-white/52">
                  Qty {getQuantityLabel(rfq)}
                </div>

                <div className="text-[11px] uppercase tracking-[0.22em] text-white/52">
                  {formatDateLabel(rfq.createdAt)}
                </div>

                <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em]",
                      statusBadgeClass(rfq.status),
                    )}
                  >
                    {formatStatusLabel(rfq.status)}
                  </span>
                  <Link href={`/admin/rfqs/${rfq.id}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                    View
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="p-5 text-[14px] leading-[22.75px] text-white/48">
              No RFQ submissions match the current admin filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
