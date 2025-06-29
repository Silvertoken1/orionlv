import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getAllUsers, getAllCommissions, getAllPayments, getAllActivationPins } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const users = getAllUsers()
    const commissions = getAllCommissions()
    const payments = getAllPayments()
    const pins = getAllActivationPins()

    const stats = {
      users: {
        total: users.length,
        active: users.filter((u) => u.status === "active").length,
        inactive: users.filter((u) => u.status === "inactive").length,
        suspended: users.filter((u) => u.status === "suspended").length,
        newThisMonth: users.filter((u) => {
          const monthAgo = new Date()
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return u.createdAt > monthAgo
        }).length,
      },
      commissions: {
        total: commissions.length,
        pending: commissions.filter((c) => c.status === "pending").length,
        approved: commissions.filter((c) => c.status === "approved").length,
        rejected: commissions.filter((c) => c.status === "rejected").length,
        totalAmount: commissions.reduce((sum, c) => sum + c.amount, 0),
        approvedAmount: commissions.filter((c) => c.status === "approved").reduce((sum, c) => sum + c.amount, 0),
      },
      payments: {
        total: payments.length,
        completed: payments.filter((p) => p.status === "completed").length,
        pending: payments.filter((p) => p.status === "pending").length,
        failed: payments.filter((p) => p.status === "failed").length,
        totalAmount: payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
      },
      pins: {
        total: pins.length,
        active: pins.filter((p) => p.status === "active").length,
        used: pins.filter((p) => p.status === "used").length,
        expired: pins.filter((p) => p.status === "expired").length,
        totalValue: pins.reduce((sum, p) => sum + p.amount, 0),
      },
      revenue: {
        totalRegistrations: payments
          .filter((p) => p.type === "registration" && p.status === "completed")
          .reduce((sum, p) => sum + p.amount, 0),
        totalCommissionsPaid: commissions.filter((c) => c.status === "approved").reduce((sum, c) => sum + c.amount, 0),
        netRevenue:
          payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0) -
          commissions.filter((c) => c.status === "approved").reduce((sum, c) => sum + c.amount, 0),
      },
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("required") ? 401 : 500 },
    )
  }
}
