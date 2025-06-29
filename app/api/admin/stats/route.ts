// This ensures Next.js treats this route as dynamic (due to request headers usage)
export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { getStats } from "@/lib/database";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

// GET: Retrieve site/admin stats (Admin-only)
export async function GET(request: NextRequest) {
  try {
    // Extract token from request headers or cookies
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode and validate token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Fetch stats from database
    const stats = await getStats();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
