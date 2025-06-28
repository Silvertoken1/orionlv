import { type NextRequest, NextResponse } from "next/server"
import { initializeNeonDatabase } from "@/lib/db/neon"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // Check if this is a production initialization request
    const { authorization } = await request.json()

    // Simple authorization check (you can make this more secure)
    if (authorization !== process.env.INIT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🚀 Starting production database initialization...")

    const result = await initializeNeonDatabase()

    return NextResponse.json({
      success: true,
      message: "Production database initialized successfully!",
      data: result,
    })
  } catch (error) {
    console.error("❌ Production database initialization failed:", error)

    return NextResponse.json(
      {
        error: "Database initialization failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Production database initialization endpoint",
    instructions: "Send POST request with authorization token to initialize database",
  })
}
