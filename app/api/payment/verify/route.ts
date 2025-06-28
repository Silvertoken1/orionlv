import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createPayment, createCommission, findUserById, updateUser } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request)
    const { reference, amount, type = "registration" } = await request.json()

    if (!reference || !amount) {
      return NextResponse.json({ error: "Reference and amount are required" }, { status: 400 })
    }

    // Create payment record
    const payment = createPayment({
      userId: user.id,
      amount: Number(amount),
      type,
      status: "completed",
      reference,
      description: `${type} payment verification`,
    })

    // Update user balance
    updateUser(user.id, {
      balance: user.balance + Number(amount),
    })

    // Create commissions for sponsor if registration payment
    if (type === "registration" && user.sponsorId) {
      const sponsor = findUserById(user.sponsorId)
      if (sponsor) {
        // Level 1 commission (25% of registration fee)
        const level1Commission = Math.floor(Number(amount) * 0.25)
        createCommission({
          userId: sponsor.id,
          fromUserId: user.id,
          amount: level1Commission,
          level: 1,
          type: "registration",
          status: "pending",
          description: `Level 1 registration commission from ${user.firstName} ${user.lastName}`,
        })

        // Level 2 commission if sponsor has a sponsor (10% of registration fee)
        if (sponsor.sponsorId) {
          const level2Sponsor = findUserById(sponsor.sponsorId)
          if (level2Sponsor) {
            const level2Commission = Math.floor(Number(amount) * 0.1)
            createCommission({
              userId: level2Sponsor.id,
              fromUserId: user.id,
              amount: level2Commission,
              level: 2,
              type: "registration",
              status: "pending",
              description: `Level 2 registration commission from ${user.firstName} ${user.lastName}`,
            })
          }
        }
      }
    }

    return NextResponse.json({
      message: "Payment verified successfully",
      payment: {
        id: payment.id,
        amount: payment.amount,
        type: payment.type,
        status: payment.status,
        reference: payment.reference,
        createdAt: payment.createdAt,
      },
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("required") ? 401 : 500 },
    )
  }
}
