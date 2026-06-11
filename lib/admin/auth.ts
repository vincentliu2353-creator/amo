import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createAdminSupabaseClient } from "@/lib/supabase/server";

export const ADMIN_SESSION_COOKIE_NAME = "amo_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

export type AdminSessionMode = "env" | "supabase";

export interface AdminSession {
  email: string;
  mode: AdminSessionMode;
  authUserId?: string;
  expiresAt: number;
}

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "AdminAuthError";
    this.status = status;
  }
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getAdminSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!secret) {
    throw new AdminAuthError(
      "Admin session signing is not configured. Set ADMIN_PASSWORD, ADMIN_SESSION_SECRET, or Supabase credentials.",
      503,
    );
  }

  return secret;
}

function signAdminSessionPayload(payload: string) {
  return createHmac("sha256", getAdminSessionSecret()).update(payload).digest("base64url");
}

function encodeAdminSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  const signature = signAdminSessionPayload(payload);

  return `${payload}.${signature}`;
}

function decodeAdminSession(token: string) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signAdminSessionPayload(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<AdminSession>;

    if (
      typeof parsed.email !== "string" ||
      typeof parsed.mode !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    if (parsed.mode !== "env" && parsed.mode !== "supabase") {
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      return null;
    }

    return {
      email: parsed.email,
      mode: parsed.mode,
      authUserId: typeof parsed.authUserId === "string" ? parsed.authUserId : undefined,
      expiresAt: parsed.expiresAt,
    } satisfies AdminSession;
  } catch {
    return null;
  }
}

export function getAdminSessionCookieOptions(maxAge = ADMIN_SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function createAdminSessionToken(
  session: Omit<AdminSession, "expiresAt"> & { expiresAt?: number },
) {
  return encodeAdminSession({
    ...session,
    expiresAt: session.expiresAt ?? Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decodeAdminSession(token);
}

export async function assertAdminApiSession() {
  const session = await getAdminSession();

  if (!session) {
    throw new AdminAuthError("Unauthorized.", 401);
  }

  return session;
}

export async function requireAdminPageSession(nextPath: string) {
  const session = await getAdminSession();

  if (!session) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}

export function getSafeAdminRedirectPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/")) {
    return "/admin";
  }

  if (!value.startsWith("/admin")) {
    return "/admin";
  }

  if (value.startsWith("//")) {
    return "/admin";
  }

  return value;
}

function hasTemporaryAdminCredentials() {
  return Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD?.trim());
}

function hasSupabaseAdminAuth() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

async function authenticateWithTemporaryCredentials(email: string, password: string) {
  const configuredEmail = normalizeEmail(process.env.ADMIN_EMAIL ?? "");
  const configuredPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!configuredEmail || !configuredPassword) {
    return null;
  }

  if (normalizeEmail(email) !== configuredEmail || password !== configuredPassword) {
    return null;
  }

  return {
    email: configuredEmail,
    mode: "env" as const,
  };
}

async function authenticateWithSupabase(email: string, password: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new AdminAuthError("Supabase Auth is not configured for admin login.", 503);
  }

  const supabaseAuthClient = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: authResult, error: authError } = await supabaseAuthClient.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authResult.user) {
    throw new AdminAuthError("Invalid email or password.", 401);
  }

  const supabase = createAdminSupabaseClient();
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("auth_user_id, email, role, is_active")
    .eq("auth_user_id", authResult.user.id)
    .maybeSingle();

  if (profileError) {
    throw new AdminAuthError(`Unable to verify admin access: ${profileError.message}`, 503);
  }

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    throw new AdminAuthError("This account does not have admin access.", 403);
  }

  return {
    email: normalizeEmail(profile.email ?? authResult.user.email ?? email),
    mode: "supabase" as const,
    authUserId: authResult.user.id,
  };
}

export async function authenticateAdminCredentials(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = password.trim();

  if (!normalizedEmail || !normalizedPassword) {
    throw new AdminAuthError("Email and password are required.", 400);
  }

  if (hasTemporaryAdminCredentials()) {
    const temporarySession = await authenticateWithTemporaryCredentials(
      normalizedEmail,
      normalizedPassword,
    );

    if (temporarySession) {
      return temporarySession;
    }

    if (!hasSupabaseAdminAuth()) {
      throw new AdminAuthError("Invalid email or password.", 401);
    }
  }

  if (!hasSupabaseAdminAuth()) {
    throw new AdminAuthError(
      "Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD, or configure Supabase Auth.",
      503,
    );
  }

  return authenticateWithSupabase(normalizedEmail, normalizedPassword);
}
