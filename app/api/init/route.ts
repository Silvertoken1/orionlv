import { NextResponse } from "next/server"
import { getAllUsers, getAllCommissions, getAllPayments, getAllActivationPins } from "@/lib/database"

export async function GET() {
  try {
    const users = getAllUsers()
    const commissions = getAllCommissions()
    const payments = getAllPayments()
    const pins = getAllActivationPins()

    return NextResponse.json({
      message: "Database initialized successfully",
      testCredentials: {
        admin: {
          email: "admin@brightorian.com",
          password: "Admin123!",
          role: "admin",
        },
        user: {
          email: "john.doe@brightorian.com",
          password: "User123!",
          role: "user",
        },
      },
      stats: {
        users: users.length,
        commissions: commissions.length,
        payments: payments.length,
        activationPins: pins.length,
      },
      sampleData: {
        users: users.map((u) => ({
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          memberId: u.memberId,
          role: u.role,
          status: u.status,
          balance: u.balance,
          totalEarnings: u.totalEarnings,
        })),
        commissions: commissions.map((c) => ({
          id: c.id,
          userId: c.userId,
          amount: c.amount,
          level: c.level,
          type: c.type,
          status: c.status,
          description: c.description,
        })),
        payments: payments.map((p) => ({
          id: p.id,
          userId: p.userId,
          amount: p.amount,
          type: p.type,
          status: p.status,
          reference: p.reference,
        })),
        pins: pins.map((p) => ({
          id: p.id,
          pin: p.pin,
          amount: p.amount,
          status: p.status,
        })),
      },
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
