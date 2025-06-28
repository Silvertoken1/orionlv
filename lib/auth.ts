import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-minimum-32-characters-long"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface TokenPayload {
  userId: string
  email: string
  isAdmin: boolean
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export const getTokenFromCookies = async (): Promise<string | null> => {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")
    return token?.value || null
  } catch (error) {
    console.error("Error getting token from cookies:", error)
    return null
  }
}

export const getCurrentUser = async (): Promise<TokenPayload | null> => {
  try {
    const token = await getTokenFromCookies()
    if (!token) return null

    return verifyToken(token)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
