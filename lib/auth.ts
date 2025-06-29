import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"
import { findUserById } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface TokenPayload {
  userId: string
  email: string
  role: "admin" | "user"
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  const cookieToken = request.cookies.get("auth-token")
  return cookieToken?.value || null
}

export async function requireAuth(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    throw new Error("Authentication required")
  }

  const payload = verifyToken(token)
  if (!payload) {
    throw new Error("Invalid token")
  }

  const user = findUserById(payload.userId)
  if (!user) {
    throw new Error("User not found")
  }

  return { user, payload }
}

export async function requireAdmin(request: NextRequest) {
  const { user, payload } = await requireAuth(request)

  if (user.role !== "admin") {
    throw new Error("Admin access required")
  }

  return { user, payload }
}
