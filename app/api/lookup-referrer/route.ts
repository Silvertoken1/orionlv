import { type NextRequest, NextResponse } from "next/server"
import { findUserByMemberId } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { memberId } = await request.json()

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }

    const user = findUserByMemberId(memberId)
    if (!user) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({
      member: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        memberId: user.memberId,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Lookup referrer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
