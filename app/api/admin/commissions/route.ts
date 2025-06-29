export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { getAllCommissions, updateCommissionStatus } from "@/lib/database";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const commissions = await getAllCommissions();

    return NextResponse.json({
      commissions,
      total: commissions.length,
    });
  } catch (error) {
    console.error("Get commissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
