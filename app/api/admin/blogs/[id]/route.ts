import { NextResponse } from "next/server";

import {
  AdminAuthError,
  assertAdminApiSession,
} from "@/lib/admin/auth";
import {
  AdminBlogMutationError,
  deleteAdminBlog,
  updateAdminBlog,
} from "@/lib/admin/blogs";

export const runtime = "nodejs";

function errorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  if (error instanceof AdminBlogMutationError) {
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
      message: error instanceof Error ? error.message : "Unable to process the admin blog request.",
    },
    { status: 503 },
  );
}

interface AdminBlogRouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: AdminBlogRouteContext) {
  try {
    const session = await assertAdminApiSession();
    const { id } = await context.params;
    const formData = await request.formData();
    const result = await updateAdminBlog(id, formData, session);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: AdminBlogRouteContext) {
  try {
    await assertAdminApiSession();
    const { id } = await context.params;
    const result = await deleteAdminBlog(id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
