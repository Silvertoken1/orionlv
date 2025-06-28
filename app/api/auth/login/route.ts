import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, verifyPassword } from "@/lib/database"
import { generateToken } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("🔐 Login attempt for email:", email)

    if (!email || !password) {
      console.log("❌ Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await findUserByEmail(email.toLowerCase().trim())
    console.log("👤 User found:", user ? `Yes (ID: ${user.id})` : "No")

    if (!user) {
      console.log("❌ User not found for email:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("🔍 User details:", {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      hasPassword: !!user.password,
    })

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    console.log("🔑 Password verification:", isValidPassword ? "✅ Valid" : "❌ Invalid")

    if (!isValidPassword) {
      console.log("❌ Password verification failed for user:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!user.isActive) {
      console.log("❌ User account is not active:", email)
      return NextResponse.json({ error: "Account is not active. Please contact support." }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    })

    console.log("✅ Login successful for:", email, "Admin:", user.isAdmin)

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        memberId: user.memberId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        totalEarnings: user.totalEarnings,
        pendingEarnings: user.pendingEarnings,
      },
      token,
      redirectUrl: user.isAdmin ? "/admin" : "/dashboard",
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("💥 Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
