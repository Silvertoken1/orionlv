import { type NextRequest, NextResponse } from "next/server"
import { getAllStockists, getAllUsers } from "@/lib/database"
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

    const stockists = await getAllStockists()
    const users = await getAllUsers()

    // Get stockists with user information
    const stockistsWithUsers = stockists
      .map((stockist) => {
        const user = users.find((u) => u.id === stockist.userId)
        return {
          ...stockist,
          user: user
            ? {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                memberId: user.memberId,
              }
            : null,
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ stockists: stockistsWithUsers })
  } catch (error) {
    console.error("Get stockists error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
