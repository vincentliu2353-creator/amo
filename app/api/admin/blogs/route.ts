import { NextResponse } from "next/server";

import {
  AdminAuthError,
  assertAdminApiSession,
} from "@/lib/admin/auth";
import {
  AdminBlogMutationError,
  createAdminBlog,
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
      message: error instanceof Error ? error.message : "Unable to save the blog post.",
    },
    { status: 503 },
  );
}

export async function POST(request: Request) {
  try {
    const session = await assertAdminApiSession();
    const formData = await request.formData();
    const result = await createAdminBlog(formData, session);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
