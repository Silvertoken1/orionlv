// Ensure the route is treated as dynamic due to use of request headers (auth token)
export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { getAllCommissions, updateCommissionStatus } from "@/lib/database";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

// GET: Fetch all commissions (Admin-only)
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.isAdmin) {
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

// PATCH: Update commission status (Admin-only)
export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { commissionId, status } = body;

    if (!commissionId || !status) {
      return NextResponse.json({ error: "Commission ID and status are required" }, { status: 400 });
    }

    const allowedStatuses = ["pending", "approved", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedCommission = await updateCommissionStatus(commissionId, status);

    if (!updatedCommission) {
      return NextResponse.json({ error: "Commission not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Commission status updated successfully",
      commission: updatedCommission,
    });
  } catch (error) {
    console.error("Update commission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
