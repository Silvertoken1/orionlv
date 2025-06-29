import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getAllCommissions, updateCommissionStatus, updateUser, findUserById } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const commissions = getAllCommissions()

    return NextResponse.json({
      commissions,
      stats: {
        total: commissions.length,
        pending: commissions.filter((c) => c.status === "pending").length,
        approved: commissions.filter((c) => c.status === "approved").length,
        rejected: commissions.filter((c) => c.status === "rejected").length,
        totalAmount: commissions.reduce((sum, c) => sum + c.amount, 0),
      },
    })
  } catch (error) {
    console.error("Get commissions error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("required") ? 401 : 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Commission ID and status are required" }, { status: 400 })
    }

    const commission = updateCommissionStatus(id, status)
    if (!commission) {
      return NextResponse.json({ error: "Commission not found" }, { status: 404 })
    }

    // If approved, update user balance
    if (status === "approved") {
      const user = findUserById(commission.userId)
      if (user) {
        updateUser(user.id, {
          balance: user.balance + commission.amount,
          totalEarnings: user.totalEarnings + commission.amount,
        })
      }
    }

    return NextResponse.json({
      message: "Commission status updated successfully",
      commission,
    })
  } catch (error) {
    console.error("Update commission error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("required") ? 401 : 500 },
    )
  }
}
