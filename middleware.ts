import {NextResponse} from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  // Only match API routes if needed in the future
  matcher: [],
};
