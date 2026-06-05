import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RfqItemPayload {
  product_id?: string;
  product_name?: string;
  product_slug?: string;
  product_image?: string;
  quantity?: number;
  notes?: string;
}

interface RfqPayload {
  company_name?: string;
  contact_name?: string;
  email?: string;
  whatsapp?: string;
  country?: string;
  business_type?: string;
  estimated_quantity?: string;
  customization_requirements?: string;
  message?: string;
  items?: RfqItemPayload[];
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeQuantity(value: unknown) {
  const quantity = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return 1;
  }

  return Math.floor(quantity);
}

function normalizeItem(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const item = value as Record<string, unknown>;
  const product_slug = normalizeString(item.product_slug ?? item.productSlug);

  if (!product_slug) {
    return null;
  }

  return {
    product_id: normalizeString(item.product_id ?? item.productId),
    product_name: normalizeString(item.product_name ?? item.productName),
    product_slug,
    product_image: normalizeString(item.product_image ?? item.productImage),
    quantity: normalizeQuantity(item.quantity ?? item.requestedQty),
    notes: normalizeString(item.notes),
  };
}

function normalizePayload(payload: RfqPayload | Record<string, unknown>) {
  const record = payload as Record<string, unknown>;
  const items = Array.isArray(record.items)
    ? record.items.map((item) => normalizeItem(item)).filter((item): item is NonNullable<ReturnType<typeof normalizeItem>> => Boolean(item))
    : [];

  return {
    company_name: normalizeString(record.company_name ?? record.companyName),
    contact_name: normalizeString(record.contact_name ?? record.contactName),
    email: normalizeString(record.email),
    whatsapp: normalizeString(record.whatsapp ?? record.phone),
    country: normalizeString(record.country),
    business_type: normalizeString(record.business_type ?? record.projectStage),
    estimated_quantity: normalizeString(record.estimated_quantity ?? record.annualVolume),
    customization_requirements: normalizeString(record.customization_requirements ?? record.customizationRequirements),
    message: normalizeString(record.message),
    items,
  };
}

export async function POST(request: Request) {
  let payload: RfqPayload | Record<string, unknown>;

  try {
    payload = (await request.json()) as RfqPayload | Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid RFQ payload." }, { status: 400 });
  }

  const normalizedPayload = normalizePayload(payload);

  if (!normalizedPayload.company_name || !normalizedPayload.contact_name || !normalizedPayload.email) {
    return NextResponse.json(
      { message: "Company, contact, and email are required." },
      { status: 400 },
    );
  }

  if (normalizedPayload.items.length === 0) {
    return NextResponse.json({ message: "Select at least one product before submitting an RFQ." }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    const requestedSlugs = [...new Set(normalizedPayload.items.map((item) => item.product_slug))];

    const { data: matchedProducts, error: productsError } = await supabase
      .from("products")
      .select("id, slug, name, series, og_image_url, status")
      .in("slug", requestedSlugs);

    if (productsError) {
      throw productsError;
    }

    const productBySlug = new Map(
      (matchedProducts ?? [])
        .filter((product) => product.status === "published")
        .map((product) => [product.slug, product]),
    );

    const missingSlugs = requestedSlugs.filter((slug) => !productBySlug.has(slug));

    if (missingSlugs.length > 0) {
      return NextResponse.json(
        { message: `Unknown or unpublished products: ${missingSlugs.join(", ")}.` },
        { status: 400 },
      );
    }

    const { data: rfq, error: rfqError } = await supabase
      .from("rfq_requests")
      .insert({
        company_name: normalizedPayload.company_name,
        contact_name: normalizedPayload.contact_name,
        email: normalizedPayload.email,
        phone: normalizedPayload.whatsapp,
        country: normalizedPayload.country,
        project_stage: normalizedPayload.business_type,
        annual_volume: normalizedPayload.estimated_quantity,
        message: normalizedPayload.message,
        source: "website",
        requirements: {
          whatsapp: normalizedPayload.whatsapp,
          business_type: normalizedPayload.business_type,
          estimated_quantity: normalizedPayload.estimated_quantity,
          customization_requirements: normalizedPayload.customization_requirements,
          requested_products: normalizedPayload.items.map((item) => ({
            product_slug: item.product_slug,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      })
      .select("id, request_number")
      .single();

    if (rfqError || !rfq) {
      throw rfqError ?? new Error("RFQ record was not created.");
    }

    const { error: itemsError } = await supabase.from("rfq_items").insert(
      normalizedPayload.items.map((item) => {
        const product = productBySlug.get(item.product_slug);

        if (!product) {
          throw new Error(`Product ${item.product_slug} is not available for RFQ.`);
        }

        return {
          rfq_request_id: rfq.id,
          product_id: product.id,
          requested_qty: item.quantity,
          notes: item.notes || null,
          product_snapshot: {
            product_id: product.id,
            product_name: item.product_name || product.name,
            product_slug: product.slug,
            product_image: item.product_image || product.og_image_url || "",
            series: product.series,
          },
        };
      }),
    );

    if (itemsError) {
      await supabase.from("rfq_requests").delete().eq("id", rfq.id);
      throw itemsError;
    }

    return NextResponse.json(
      {
        message: "RFQ submitted successfully.",
        id: rfq.id,
        requestNumber: rfq.request_number,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "RFQ endpoint is not configured. Add Supabase credentials before using this route.",
      },
      { status: 503 },
    );
  }
}
