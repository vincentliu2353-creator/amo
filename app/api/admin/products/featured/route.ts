import { NextResponse } from "next/server";

import { AdminAuthError, assertAdminApiSession } from "@/lib/admin/auth";
import {
  AdminProductMutationError,
  saveAdminFeaturedProducts,
  type AdminFeaturedProductSelectionItem,
} from "@/lib/admin/products";

export const runtime = "nodejs";

function errorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  if (error instanceof AdminProductMutationError) {
    return NextResponse.json(
      {
        message: error.message,
        fieldErrors: error.fieldErrors,
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      message: error instanceof Error ? error.message : "Unable to save featured products.",
    },
    { status: 503 },
  );
}

export async function POST(request: Request) {
  try {
    await assertAdminApiSession();
    const body = (await request.json()) as {
      products?: Array<{ id?: unknown; featuredOrder?: unknown }>;
    };

    const selections: AdminFeaturedProductSelectionItem[] = Array.isArray(body.products)
      ? body.products.map((product) => ({
          id: typeof product?.id === "string" ? product.id : "",
          featuredOrder:
            typeof product?.featuredOrder === "number" && Number.isInteger(product.featuredOrder)
              ? product.featuredOrder
              : null,
        }))
      : [];
    const result = await saveAdminFeaturedProducts(selections);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
