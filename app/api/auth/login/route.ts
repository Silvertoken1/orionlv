import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, verifyPassword } from "@/lib/db/neon"
import { signToken } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("🔐 Login attempt for:", email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await findUserByEmail(email)
    if (!user) {
      console.log("❌ User not found:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("👤 User found:", user.email, "Status:", user.is_active)

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      console.log("❌ Invalid password for:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("✅ Password verified for:", email)

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({ error: "Account is inactive. Please contact support." }, { status: 401 })
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
    })

    console.log("🎫 JWT token generated for:", email)

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        member_id: user.member_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        is_admin: user.is_admin,
        total_earnings: Number.parseFloat(user.total_earnings) || 0,
        pending_earnings: Number.parseFloat(user.pending_earnings) || 0,
        withdrawn_earnings: Number.parseFloat(user.withdrawn_earnings) || 0,
        location: user.location,
      },
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    console.log("✅ Login successful for:", email)
    return response
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
