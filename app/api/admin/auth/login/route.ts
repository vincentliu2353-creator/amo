import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE_NAME,
  AdminAuthError,
  authenticateAdminCredentials,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  getSafeAdminRedirectPath,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

function buildRedirectUrl(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const nextValue = formData.get("next");
  const email = typeof emailValue === "string" ? emailValue : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const next = getSafeAdminRedirectPath(
    typeof nextValue === "string" ? nextValue : undefined,
  );

  try {
    const session = await authenticateAdminCredentials(email, password);
    const token = await createAdminSessionToken(session);
    const response = NextResponse.redirect(buildRedirectUrl(request, next), 303);

    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, getAdminSessionCookieOptions());

    return response;
  } catch (error) {
    const message =
      error instanceof AdminAuthError
        ? error.message
        : "Unable to sign in to the AMO admin workspace.";
    const loginUrl = buildRedirectUrl(
      request,
      `/admin/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(message)}&email=${encodeURIComponent(email)}`,
    );

    return NextResponse.redirect(loginUrl, 303);
  }
}
