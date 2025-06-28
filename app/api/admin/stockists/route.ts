import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getAllStockists, createStockist, updateStockist, hashPassword } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const stockists = getAllStockists()

    const safeStockists = stockists.map((stockist) => ({
      id: stockist.id,
      email: stockist.email,
      firstName: stockist.firstName,
      lastName: stockist.lastName,
      phone: stockist.phone,
      businessName: stockist.businessName,
      address: stockist.address,
      city: stockist.city,
      state: stockist.state,
      status: stockist.status,
      stockLevel: stockist.stockLevel,
      totalSales: stockist.totalSales,
      commission: stockist.commission,
      createdAt: stockist.createdAt,
    }))

    return NextResponse.json({ stockists: safeStockists })
  } catch (error) {
    console.error("Get stockists error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("required") ? 401 : 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const stockistData = await request.json()

    const { email, password, firstName, lastName, phone, businessName, address, city, state } = stockistData

    if (!email || !password || !firstName || !lastName || !phone || !businessName) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const stockist = createStockist({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      businessName,
      address: address || "",
      city: city || "",
      state: state || "",
      status: "pending",
      stockLevel: 0,
      totalSales: 0,
      commission: 0,
    })

    return NextResponse.json({
      message: "Stockist created successfully",
      stockist: {
        id: stockist.id,
        email: stockist.email,
        firstName: stockist.firstName,
        lastName: stockist.lastName,
        businessName: stockist.businessName,
        status: stockist.status,
      },
    })
  } catch (error) {
    console.error("Create stockist error:", error)
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
      return NextResponse.json({ error: "Stockist ID is required" }, { status: 400 })
    }

    const updatedStockist = updateStockist(id, updates)
    if (!updatedStockist) {
      return NextResponse.json({ error: "Stockist not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Stockist updated successfully",
      stockist: {
        id: updatedStockist.id,
        email: updatedStockist.email,
        firstName: updatedStockist.firstName,
        lastName: updatedStockist.lastName,
        businessName: updatedStockist.businessName,
        status: updatedStockist.status,
        stockLevel: updatedStockist.stockLevel,
        totalSales: updatedStockist.totalSales,
        commission: updatedStockist.commission,
      },
    })
  } catch (error) {
    console.error("Update stockist error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("required") ? 401 : 500 },
    )
  }
}
