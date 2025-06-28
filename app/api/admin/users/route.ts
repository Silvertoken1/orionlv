import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getAllUsers, updateUser } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const users = getAllUsers()

    const safeUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      memberId: user.memberId,
      sponsorId: user.sponsorId,
      role: user.role,
      status: user.status,
      balance: user.balance,
      totalEarnings: user.totalEarnings,
      createdAt: user.createdAt,
    }))

    return NextResponse.json({
      users: safeUsers,
      stats: {
        total: users.length,
        active: users.filter((u) => u.status === "active").length,
        inactive: users.filter((u) => u.status === "inactive").length,
        suspended: users.filter((u) => u.status === "suspended").length,
        admins: users.filter((u) => u.role === "admin").length,
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("required") ? 401 : 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const updatedUser = updateUser(id, updates)
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        memberId: updatedUser.memberId,
        role: updatedUser.role,
        status: updatedUser.status,
        balance: updatedUser.balance,
        totalEarnings: updatedUser.totalEarnings,
      },
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("required") ? 401 : 500 },
    )
  }
}
