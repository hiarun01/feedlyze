import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

// Get JWT secret with fallback
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {error: "Authentication required"},
        {status: 401}
      );
    }

    // Verify JWT token
    let userPayload;
    try {
      userPayload = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
      };
    } catch {
      return NextResponse.json({error: "Invalid token"}, {status: 401});
    }

    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: {id: userPayload.userId},
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({error: "User not found"}, {status: 404});
    }

    return NextResponse.json({user}, {status: 200});
  } catch (error) {
    console.error("Get user error:", error);

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
