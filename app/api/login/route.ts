import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import {z} from "zod";
import bcrypt from "bcryptjs";

// Get JWT secret with fallback
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Validation schema for login
const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(128),
  password: z.string().trim().min(6, "Password is too short").max(128),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({error: "Invalid input data"}, {status: 400});
    }

    const {email, password} = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) {
      return NextResponse.json(
        {error: "Invalid email or password"},
        {status: 401}
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {error: "Invalid email or password"},
        {status: 401}
      );
    }

    // Generate JWT token
    const tokenData = {
      userId: user.id,
      email: user.email || email,
    };
    const token = jwt.sign(tokenData, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      },
      {status: 200}
    );

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {error: "Internal server error. Please try again later."},
      {status: 500}
    );
  }
}
