import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("🔐 Login attempt for:", email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate user
    const authResult = await authenticateUser(email, password)

    if (!authResult.success) {
      console.log("❌ Authentication failed for:", email)
      return NextResponse.json({ error: authResult.message || "Invalid email or password" }, { status: 401 })
    }

    console.log("✅ Authentication successful for:", email)

    // Create response with token in cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: authResult.user,
    })

    // Set HTTP-only cookie with JWT token
    response.cookies.set("auth-token", authResult.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
