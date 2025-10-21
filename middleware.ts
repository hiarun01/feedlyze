import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {jwtVerify} from "jose";

// Define protected routes
const protectedRoutes = ["/dashboard", "/project"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Get the JWT secret
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Get the token from cookies
  const token = request.cookies.get("token")?.value;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If it's a protected route and no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If there's a token, verify it
  if (token) {
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
