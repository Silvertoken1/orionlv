// app/api/init-production/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.authorization !== process.env.INIT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🚀 Initializing production database...")
    await initializeDatabase()

    return NextResponse.json({
      success: true,
      message: "Production database initialized successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database initialization error:", error)
    return NextResponse.json(
      {
        error: "Database initialization failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
