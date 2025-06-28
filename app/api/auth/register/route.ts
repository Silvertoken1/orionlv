import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail, findUserByMemberId, hashPassword } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, sponsorId } = await request.json()

    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    let sponsor = null
    if (sponsorId) {
      sponsor = findUserByMemberId(sponsorId)
      if (!sponsor) {
        return NextResponse.json({ error: "Invalid sponsor ID" }, { status: 400 })
      }
    }

    const hashedPassword = await hashPassword(password)
    const memberId = `USR${Date.now().toString().slice(-6)}`

    const user = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      memberId,
      sponsorId: sponsor?.id,
      role: "user",
      status: "active",
      balance: 0,
      totalEarnings: 0,
    })

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        memberId: user.memberId,
        sponsorId: user.sponsorId,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
