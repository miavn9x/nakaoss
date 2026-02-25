import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseJwt } from "./shared/lib/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./language/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // ============================================================
  // SECURITY: Block Middleware Bypass via Custom Headers (F41)
  // ============================================================
  const bypassHeaders = [
    "x-original-url",
    "x-rewrite-url",
    "x-forwarded-path",
    "x-original-path",
    "x-real-url",
  ];

  for (const header of bypassHeaders) {
    if (request.headers.has(header)) {
      console.warn(`[SECURITY] Blocked bypass attempt via: ${header}`);
      return NextResponse.json(
        { error: "Forbidden: Invalid request headers" },
        { status: 403 },
      );
    }
  }

  // ============================================================
  // SECURITY: Block CSTI / Template Injection (F106/107)
  // ============================================================
  const searchParams = decodeURIComponent(request.nextUrl.search);
  const cstiPatterns = ["{{", "${", "[[", "<%", "%>", "]]"];

  if (cstiPatterns.some((pattern) => searchParams.includes(pattern))) {
    console.warn(
      `[SECURITY] Blocked potential CSTI attempt in query: ${searchParams}`,
    );
    return NextResponse.json(
      { error: "Forbidden: Malicious template syntax detected" },
      { status: 403 },
    );
  }

  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Function to handle unauthorized access
  const handleUnauthorized = () => {
    const url = new URL("/", request.url);
    const response = NextResponse.redirect(url);
    // Set a short-lived cookie to signal the client to open the login modal
    response.cookies.set("auth_modal_trigger", "login", {
      path: "/",
      maxAge: 10, // 10 seconds is enough for the client to read it after redirect
      sameSite: "lax",
    });
    return response;
  };

  // Protect Admin Routes
  if (pathname.startsWith("/wfourtech")) {
    if (!accessToken) {
      if (refreshToken) {
        return NextResponse.next();
      }
      return handleUnauthorized();
    }

    try {
      const payload = parseJwt(accessToken);
      // console.log("[PROXY DEBUG] JWT Payload:", payload);
      const allowedRoles = ["admin", "employment", "cskh"];

      // Check if user has at least one required role
      const hasRole =
        payload.roles &&
        Array.isArray(payload.roles) &&
        payload.roles.some((role: string) => allowedRoles.includes(role));

      // console.log("[PROXY DEBUG] Has required role:", hasRole);

      if (!hasRole) {
        // console.log("[PROXY DEBUG] Role check failed, redirecting");
        // User logged in but no permission -> Redirect to Home WITHOUT opening Login Modal
        const url = new URL("/", request.url);
        return NextResponse.redirect(url);
      }

      // console.log("[PROXY DEBUG] All checks passed, allowing access");
      // Bypass intlMiddleware for valid admin routes to avoid 404 (since wfourtech is outside [locale])
      const response = NextResponse.next();
      injectSecurityHeaders(response);
      return response;
    } catch (e) {
      // console.error("[PROXY DEBUG] JWT parse error:", e);
      return handleUnauthorized();
    }
  }

  // Default: Run next-intl middleware for all other routes
  const response = intlMiddleware(request);
  injectSecurityHeaders(response);
  return response;
}

/**
 * Ensures critical security headers are present in every response (F10, F114)
 */
function injectSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // COEP - Only add if not present, helps with F10 but may be too strict for some environments
  if (!response.headers.has("Cross-Origin-Embedder-Policy")) {
    // response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    // Decided to skip COEP here to avoid breaking external assets, focus on nosniff
  }
}

export const config = {
  // Catch all routes except api, _next and static assets (dot+extension at the end of the URL)
  matcher: ["/((?!api|_next|.*\\.[a-zA-Z0-9]+$).*)"],
};
