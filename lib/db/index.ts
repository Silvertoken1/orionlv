// lib/db/index.ts

import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"
import bcrypt from "bcryptjs"

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// Test DB connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1`
    console.log("✅ Connected to Neon DB")
    return true
  } catch (error) {
    console.error("❌ DB connection failed:", error)
    return false
  }
}

// Initialize database
export async function initializeDatabase() {
  try {
    console.log("🔄 Initializing database...")

    const connected = await testConnection()
    if (!connected) throw new Error("DB connection failed")

    // Create admin user if not exists
    const adminExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, process.env.ADMIN_EMAIL || "admin@brightorian.com"),
    })

    if (!adminExists) {
      console.log("🛠️ Creating admin user...")
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12)

      await db.insert(schema.users).values({
        memberId: "BO000001",
        firstName: "Admin",
        lastName: "User",
        email: process.env.ADMIN_EMAIL || "admin@brightorian.com",
        phone: process.env.ADMIN_PHONE || "+2348000000000",
        passwordHash: hashedPassword,
        status: "active",
        role: "admin",
        activationDate: new Date(),
      })

      console.log("✅ Admin user created")
    }

    // Create system settings if not exist
    const settingsExist = await db.query.systemSettings.findFirst()
    if (!settingsExist) {
      const settings = [
        { settingKey: "package_price", settingValue: "36000" },
        { settingKey: "min_withdrawal", settingValue: "5000" },
        { settingKey: "level_1_commission", settingValue: "4000" },
        { settingKey: "level_2_commission", settingValue: "2000" },
        { settingKey: "level_3_commission", settingValue: "2000" },
        { settingKey: "level_4_commission", settingValue: "1500" },
        { settingKey: "level_5_commission", settingValue: "1500" },
        { settingKey: "level_6_commission", settingValue: "1500" },
        { settingKey: "max_matrix_levels", settingValue: "6" },
        { settingKey: "referrals_per_level", settingValue: "5" },
      ]

      for (const setting of settings) {
        await db.insert(schema.systemSettings).values(setting)
      }

      console.log("✅ System settings created")
    }

    console.log("✅ DB initialization complete")
    return true
  } catch (error) {
    console.error("❌ Failed to initialize database:", error)
    throw error
  }
}

export * from "./schema"
