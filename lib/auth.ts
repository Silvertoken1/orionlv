import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getUser } from "@/lib/db/neon"

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface User {
  id: number
  member_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  status: string
  sponsor_id?: string
  upline_id?: string
  balance: number
  total_earnings: number
  total_referrals: number
  level: number
  position: number
  package_type: string
  payment_status: string
  activation_date?: string
  created_at: string
  updated_at: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    console.log("🔐 Authenticating user:", email)

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Get user from database
    const user = await getUser(normalizedEmail)

    if (!user) {
      console.log("❌ User not found:", normalizedEmail)
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    console.log("👤 User found:", user.email, "Status:", user.status)

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      console.log("❌ Invalid password for user:", normalizedEmail)
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    console.log("✅ Password verified for user:", normalizedEmail)

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        memberId: user.member_id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )

    console.log("🎫 JWT token generated for user:", normalizedEmail)

    // Return success with user data and token
    return {
      success: true,
      user: {
        id: user.id,
        member_id: user.member_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        sponsor_id: user.sponsor_id,
        upline_id: user.upline_id,
        balance: Number.parseFloat(user.balance) || 0,
        total_earnings: Number.parseFloat(user.total_earnings) || 0,
        total_referrals: user.total_referrals || 0,
        level: user.level || 1,
        position: user.position || 1,
        package_type: user.package_type || "starter",
        payment_status: user.payment_status || "pending",
        activation_date: user.activation_date,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
      message: "Authentication successful",
    }
  } catch (error) {
    console.error("❌ Authentication error:", error)
    return {
      success: false,
      message: "Authentication failed",
    }
  }
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    console.error("❌ Token verification failed:", error)
    return null
  }
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
