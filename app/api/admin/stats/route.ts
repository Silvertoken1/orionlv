import { type NextRequest, NextResponse } from "next/server"
import { getStats } from "@/lib/database"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Get token from request
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const stats = await getStats()

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
