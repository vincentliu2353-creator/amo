import { NextResponse } from "next/server";

import { AdminAuthError, assertAdminApiSession } from "@/lib/admin/auth";
import {
  AdminProductMutationError,
  deleteAdminProduct,
  updateAdminProduct,
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
      message: error instanceof Error ? error.message : "Unable to process the admin product request.",
    },
    { status: 503 },
  );
}

interface AdminProductRouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: AdminProductRouteContext) {
  try {
    await assertAdminApiSession();
    const { id } = await context.params;
    const formData = await request.formData();
    const result = await updateAdminProduct(id, formData);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: AdminProductRouteContext) {
  try {
    await assertAdminApiSession();
    const { id } = await context.params;
    const result = await deleteAdminProduct(id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
