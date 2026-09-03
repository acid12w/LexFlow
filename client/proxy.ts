import { NextRequest, NextResponse } from "next/server";

function handleAuthentication(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const userRole = request.cookies;

  console.log(userRole);

  if (!token) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Return null to signal authentication passed smoothly
  return null;
}

function handleAdminRoutes(request: NextRequest) {
  // FIX: Access roles via server-side cookies rather than client-side localStorage
  const userRole = request.cookies.get("user_role")?.value;

  console.log(userRole);

  if (userRole !== "admin") {
    // FIX: Avoid infinite routing loops by forcing unauthorized users away from their requested target path
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return null;
}

// CORRECT CONVENTION: Exporting the named 'proxy' function for Next.js 16+
export function proxy(request: NextRequest) {
  // 1. Process base authentication
  const authResponse = handleAuthentication(request);
  if (authResponse) return authResponse;
  // 2. Process admin specific path authorization
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminResponse = handleAdminRoutes(request);
    if (adminResponse) return adminResponse;
  }
  // 3. Complete structural continuation if all filters pass safely
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user-dashboard/:path*",
    "/clients/:path*",
    "/matters/:path*",
    "/tasks/:path*",
    "/settings/:path*",
    "/admin/:path*", // Include your administration target paths inside your matcher constraints
  ],
};
