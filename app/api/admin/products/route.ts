import { NextResponse } from "next/server";

import { AdminAuthError, assertAdminApiSession } from "@/lib/admin/auth";
import { AdminProductMutationError, createAdminProduct } from "@/lib/admin/products";

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
      message: error instanceof Error ? error.message : "Unable to save the product.",
    },
    { status: 503 },
  );
}

export async function POST(request: Request) {
  try {
    await assertAdminApiSession();
    const formData = await request.formData();
    const result = await createAdminProduct(formData);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
