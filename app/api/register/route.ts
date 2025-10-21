import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import {z} from "zod";
import bcrypt from "bcryptjs";

// Enhanced validation schema
const registerSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().trim().min(6).max(100),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    // Get JWT secret with validation
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    // Validate input data
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
        },
        {status: 400}
      );
    }

    const {fullName, email, password} = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {email: email},
    });

    if (existingUser) {
      return NextResponse.json(
        {error: "An account with this email address already exists"},
        {status: 409}
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        fullName: fullName,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const tokenData = {
      userId: newUser.id,
      email: newUser.email || email,
    };
    const token = jwt.sign(tokenData, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Create response
    const response = NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
        },
      },
      {status: 201}
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
    console.error("Registration error:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          {error: "An account with this email already exists"},
          {status: 409}
        );
      }
    }

    return NextResponse.json(
      {error: "Internal server error. Please try again later."},
      {status: 500}
    );
  }
}
