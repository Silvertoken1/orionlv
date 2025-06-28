import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, updateUser } from "@/lib/database"
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

    const users = await getAllUsers()

    // Remove sensitive information
    const safeUsers = users.map((user) => ({
      id: user.id,
      memberId: user.memberId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      sponsorId: user.sponsorId,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      totalEarnings: user.totalEarnings,
      pendingEarnings: user.pendingEarnings,
      withdrawnEarnings: user.withdrawnEarnings,
    }))

    return NextResponse.json({
      users: safeUsers,
      total: safeUsers.length,
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { userId, updates } = body

    if (!userId || !updates) {
      return NextResponse.json({ error: "User ID and updates are required" }, { status: 400 })
    }

    // Prevent updating sensitive fields
    const allowedUpdates = {
      isActive: updates.isActive,
      firstName: updates.firstName,
      lastName: updates.lastName,
      phone: updates.phone,
    }

    // Remove undefined values
    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key as keyof typeof allowedUpdates] === undefined) {
        delete allowedUpdates[key as keyof typeof allowedUpdates]
      }
    })

    const updatedUser = await updateUser(userId, allowedUpdates)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const safeUser = {
      id: updatedUser.id,
      memberId: updatedUser.memberId,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      sponsorId: updatedUser.sponsorId,
      isActive: updatedUser.isActive,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      totalEarnings: updatedUser.totalEarnings,
      pendingEarnings: updatedUser.pendingEarnings,
      withdrawnEarnings: updatedUser.withdrawnEarnings,
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: safeUser,
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
