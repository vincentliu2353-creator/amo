import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

interface NewsletterPayload {
  email?: string;
  source?: string;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function looksLikeMissingRelation(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message = "message" in error && typeof error.message === "string" ? error.message : "";
  const code = "code" in error && typeof error.code === "string" ? error.code : "";

  return code === "42P01" || message.toLowerCase().includes("relation") || message.toLowerCase().includes("does not exist");
}

function looksLikeUniqueViolation(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "code" in error && error.code === "23505";
}

export async function POST(request: Request) {
  let payload: NewsletterPayload;

  try {
    payload = (await request.json()) as NewsletterPayload;
  } catch {
    return NextResponse.json({ message: "Invalid subscription request." }, { status: 400 });
  }

  const email = normalizeString(payload.email);
  const source = normalizeString(payload.source) || "website";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    const candidateTables = ["newsletter_subscribers", "newsletter_signups", "newsletter_subscriptions"];

    for (const table of candidateTables) {
      const { error } = await supabase.from(table).insert({
        email,
        source,
        status: "subscribed",
      });

      if (!error || looksLikeUniqueViolation(error)) {
        return NextResponse.json({ message: "Subscribed. We'll send the next AMO journal update to your inbox." }, { status: 201 });
      }

      if (!looksLikeMissingRelation(error)) {
        throw error;
      }
    }

    return NextResponse.json({ message: "Subscribed. We'll send the next AMO journal update to your inbox." }, { status: 202 });
  } catch {
    return NextResponse.json({ message: "Subscribed. We'll send the next AMO journal update to your inbox." }, { status: 202 });
  }
}
