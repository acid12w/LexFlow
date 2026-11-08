import { NextRequest, NextResponse } from "next/server";

// NOTE: Authentication is intentionally NOT checked here.
//
// In production the API (Render) and the web app (a different domain) don't
// share cookies: the `token` cookie is set for the API's domain, so this proxy
// can never see it and would redirect every signed-in user back to /sign-in.
// (It only appeared to work on localhost because cookies are shared across
// ports.) The API verifies the cookie on every request, and the axios 401
// interceptor in app/api/api.tsx sends signed-out users to /sign-in.

function handleAdminRoutes(request: NextRequest) {
  const userRole = request.cookies.get("user_role")?.value;

  if (userRole !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return null;
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminResponse = handleAdminRoutes(request);
    if (adminResponse) return adminResponse;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
