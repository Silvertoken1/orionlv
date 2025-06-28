import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { findCommissionsByUserId, findPaymentsByUserId } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request)

    const commissions = findCommissionsByUserId(user.id)
    const payments = findPaymentsByUserId(user.id)

    const profile = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        memberId: user.memberId,
        sponsorId: user.sponsorId,
        balance: user.balance,
        totalEarnings: user.totalEarnings,
        status: user.status,
        createdAt: user.createdAt,
      },
      commissions: {
        total: commissions.length,
        pending: commissions.filter((c) => c.status === "pending").length,
        approved: commissions.filter((c) => c.status === "approved").length,
        totalAmount: commissions.reduce((sum, c) => sum + c.amount, 0),
        approvedAmount: commissions.filter((c) => c.status === "approved").reduce((sum, c) => sum + c.amount, 0),
        recent: commissions.slice(0, 5),
      },
      payments: {
        total: payments.length,
        completed: payments.filter((p) => p.status === "completed").length,
        pending: payments.filter((p) => p.status === "pending").length,
        totalAmount: payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
        recent: payments.slice(0, 5),
      },
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("required") ? 401 : 500 },
    )
  }
}
