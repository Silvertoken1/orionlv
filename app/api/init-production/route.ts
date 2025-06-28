import { type NextRequest, NextResponse } from "next/server"
import { createTables, seedDatabase } from "@/lib/db/neon"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simple authorization check
    if (body.authorization !== process.env.INIT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🚀 Initializing production database...")

    // Create tables
    await createTables()

    // Seed with sample data
    await seedDatabase()

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
