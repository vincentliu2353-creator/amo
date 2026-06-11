import { NextResponse } from "next/server";

import {
  AdminAuthError,
  assertAdminApiSession,
} from "@/lib/admin/auth";
import {
  AdminRfqMutationError,
  updateAdminRfq,
} from "@/lib/admin/rfqs";

export const runtime = "nodejs";

function errorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  if (error instanceof AdminRfqMutationError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  return NextResponse.json(
    {
      message: error instanceof Error ? error.message : "Unable to update the RFQ.",
    },
    { status: 503 },
  );
}

interface AdminRfqRouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: AdminRfqRouteContext) {
  let payload: {
    adminNotes?: string;
    status?: string;
  };

  try {
    await assertAdminApiSession();
    const { id } = await context.params;

    try {
      payload = (await request.json()) as {
        adminNotes?: string;
        status?: string;
      };
    } catch {
      return NextResponse.json({ message: "Invalid RFQ update payload." }, { status: 400 });
    }

    const rfq = await updateAdminRfq(id, {
      adminNotes: typeof payload.adminNotes === "string" ? payload.adminNotes : "",
      status: typeof payload.status === "string" ? payload.status : "",
    });

    return NextResponse.json(
      {
        message: "RFQ updated successfully.",
        rfq,
      },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
