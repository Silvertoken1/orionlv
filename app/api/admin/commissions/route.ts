import { type NextRequest, NextResponse } from "next/server"
import { getAllCommissions, updateCommissionStatus } from "@/lib/database"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Get token from request
    const authHeader = request.headers.get("authorization")
    const cookieToken = request.cookies.get("auth-token")?.value

    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : cookieToken

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token and check admin status
    const jwt = require("jsonwebtoken")
    const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"

    let payload
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (!payload.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const commissions = await getAllCommissions()

    return NextResponse.json({
      commissions,
      total: commissions.length,
    })
  } catch (error) {
    console.error("Get commissions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get token from request
    const authHeader = request.headers.get("authorization")
    const cookieToken = request.cookies.get("auth-token")?.value

    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : cookieToken

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token and check admin status
    const jwt = require("jsonwebtoken")
    const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"

    let payload
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (!payload.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { commissionId, status } = body

    if (!commissionId || !status) {
      return NextResponse.json({ error: "Commission ID and status are required" }, { status: 400 })
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updatedCommission = await updateCommissionStatus(commissionId, status)

    if (!updatedCommission) {
      return NextResponse.json({ error: "Commission not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Commission status updated successfully",
      commission: updatedCommission,
    })
  } catch (error) {
    console.error("Update commission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
