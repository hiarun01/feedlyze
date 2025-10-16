import {prisma, connectDB} from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await connectDB();

  try {
    const body = await request.json();
    const {fullName, email, password} = body;

    // Input validation
    if (!fullName || !email || !password) {
      return new Response(
        JSON.stringify({
          error: "All fields (fullName, email, password) are required",
        }),
        {status: 400, headers: {"Content-Type": "application/json"}}
      );
    }

    // Password length validation
    if (password.length < 6) {
      return new Response(
        JSON.stringify({error: "Password must be at least 6 characters long"}),
        {status: 400, headers: {"Content-Type": "application/json"}}
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {email: email},
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({error: "User with this email already exists"}),
        {status: 409, headers: {"Content-Type": "application/json"}}
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        // Never return password
      },
    });

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: newUser,
      }),
      {status: 201, headers: {"Content-Type": "application/json"}}
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
  }
}
