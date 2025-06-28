import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"
import { findUserById } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface JWTPayload {
  userId: string
  email: string
  isAdmin: boolean
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export const getTokenFromRequest = (request: NextRequest): string | null => {
  // Try to get token from Authorization header
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  // Try to get token from cookies
  const tokenFromCookie = request.cookies.get("auth-token")?.value || request.cookies.get("token")?.value
  if (tokenFromCookie) {
    return tokenFromCookie
  }

  return null
}

export const getCurrentUser = async (request: NextRequest) => {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const user = await findUserById(payload.userId)
  return user
}

export const requireAuth = async (request: NextRequest) => {
  const user = await getCurrentUser(request)
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export const requireAdmin = async (request: NextRequest) => {
  const user = await requireAuth(request)
  if (!user.isAdmin) {
    throw new Error("Admin access required")
  }
  return user
}
