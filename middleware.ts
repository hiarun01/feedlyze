import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {jwtVerify} from "jose";

// Define protected routes
const protectedRoutes = ["/dashboard", "/project"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get("token")?.value;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get the JWT secret - only needed for token verification
  const jwtSecret = process.env.JWT_SECRET;

  // If it's a protected route and no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If there's a token, verify it (only if JWT_SECRET is available)
  if (token && jwtSecret) {
    try {
      const secret = new TextEncoder().encode(jwtSecret);
      const {payload} = await jwtVerify(token, secret);

      // If user is authenticated and trying to access auth routes, redirect to dashboard
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Add user info to headers for API routes
      const response = NextResponse.next();
      response.headers.set("x-user-id", payload.userId as string);
      response.headers.set("x-user-email", payload.email as string);
      return response;
    } catch (error) {
      console.error("JWT verification failed:", error);

      // If token is invalid and trying to access protected route, redirect to login
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }
    }
  } else if (token && !jwtSecret) {
    // If token exists but JWT_SECRET is missing, treat as unauthenticated
    console.warn("JWT_SECRET not available, treating user as unauthenticated");
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
