import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Get the database URL from environment variables
const sql = neon(process.env.DATABASE_URL!)

// Create the database instance
export const db = drizzle(sql, { schema })

// Test database connection
export async function testNeonConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("✅ Neon database connected successfully!")
    return true
  } catch (error) {
    console.error("❌ Neon database connection failed:", error)
    return false
  }
}

// Initialize Neon database with tables and data
export async function initializeNeonDatabase() {
  try {
    console.log("🚀 Starting Neon database initialization...")

    // Test connection first
    const connected = await testNeonConnection()
    if (!connected) {
      throw new Error("Database connection failed")
    }

    // Create tables
    await createNeonTables()

    // Create admin user
    await createAdminUser()

    // Create test users
    await createTestUsers()

    // Create system settings
    await createSystemSettings()

    // Create sample data
    await createSampleData()

    console.log("🎉 Neon database initialization completed!")

    return {
      success: true,
      message: "Neon database initialized successfully",
      adminCredentials: {
        email: "admin@brightorian.com",
        password: "BrightAdmin2024!",
      },
      userCredentials: [
        { email: "john.doe@brightorian.com", password: "BrightUser2024!" },
        { email: "jane.smith@brightorian.com", password: "BrightUser2024!" },
        { email: "mike.johnson@brightorian.com", password: "BrightUser2024!" },
      ],
    }
  } catch (error) {
    console.error("❌ Neon database initialization failed:", error)
    throw error
  }
}

async function createNeonTables() {
  console.log("📋 Creating Neon database tables...")

  // Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      member_id VARCHAR(50) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      sponsor_id VARCHAR(50),
      upline_id VARCHAR(50),
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      role VARCHAR(20) DEFAULT 'user' NOT NULL,
      balance DECIMAL(15,2) DEFAULT 0 NOT NULL,
      total_earnings DECIMAL(15,2) DEFAULT 0 NOT NULL,
      total_referrals INTEGER DEFAULT 0 NOT NULL,
      level INTEGER DEFAULT 1 NOT NULL,
      position INTEGER DEFAULT 1 NOT NULL,
      package_type VARCHAR(50) DEFAULT 'starter' NOT NULL,
      payment_status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      activation_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `

  // Create activation_pins table
  await sql`
    CREATE TABLE IF NOT EXISTS activation_pins (
      id SERIAL PRIMARY KEY,
      pin VARCHAR(20) UNIQUE NOT NULL,
      status VARCHAR(20) DEFAULT 'available' NOT NULL,
      generated_by VARCHAR(50) NOT NULL,
      used_by VARCHAR(50),
      custom_for VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      used_at TIMESTAMP
    )
  `

  // Create commissions table
  await sql`
    CREATE TABLE IF NOT EXISTS commissions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      from_user_id VARCHAR(50) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      level INTEGER NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      approved_at TIMESTAMP
    )
  `

  // Create payments table
  await sql`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'NGN' NOT NULL,
      payment_method VARCHAR(50) DEFAULT 'paystack' NOT NULL,
      reference VARCHAR(100) UNIQUE NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      metadata TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `

  // Create withdrawals table
  await sql`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      bank_name VARCHAR(100) NOT NULL,
      account_number VARCHAR(20) NOT NULL,
      account_name VARCHAR(100) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      processed_by VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      processed_at TIMESTAMP
    )
  `

  // Create system_settings table
  await sql`
    CREATE TABLE IF NOT EXISTS system_settings (
      id SERIAL PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT NOT NULL,
      description TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `

  // Create transactions table
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      type VARCHAR(50) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      description TEXT NOT NULL,
      reference VARCHAR(100),
      status VARCHAR(20) DEFAULT 'completed' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `

  // Create stockists table
  await sql`
    CREATE TABLE IF NOT EXISTS stockists (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20) NOT NULL,
      address TEXT NOT NULL,
      state VARCHAR(100) NOT NULL,
      lga VARCHAR(100) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      stock_level INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `

  console.log("✅ All Neon tables created successfully!")
}

async function createAdminUser() {
  console.log("👤 Creating admin user...")

  const bcrypt = await import("bcryptjs")
  const hashedPassword = await bcrypt.hash("BrightAdmin2024!", 12)

  await sql`
    INSERT INTO users (
      member_id, first_name, last_name, email, phone,
      password_hash, status, role, activation_date, balance, total_earnings
    ) VALUES (
      'BO000001', 'System', 'Administrator', 'admin@brightorian.com', '+2348123456789',
      ${hashedPassword}, 'active', 'admin', CURRENT_TIMESTAMP, 0, 0
    )
    ON CONFLICT (email) DO UPDATE SET
      password_hash = ${hashedPassword},
      updated_at = CURRENT_TIMESTAMP
  `

  console.log("✅ Admin user created!")
}

async function createTestUsers() {
  console.log("👥 Creating test users...")

  const bcrypt = await import("bcryptjs")
  const hashedPassword = await bcrypt.hash("BrightUser2024!", 12)

  const testUsers = [
    {
      memberId: "BO000002",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@brightorian.com",
      phone: "+2348987654321",
      sponsorId: "BO000001",
      uplineId: "BO000001",
      balance: 25000,
      totalEarnings: 45000,
      totalReferrals: 3,
    },
    {
      memberId: "BO000003",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@brightorian.com",
      phone: "+2348876543210",
      sponsorId: "BO000002",
      uplineId: "BO000002",
      balance: 18000,
      totalEarnings: 32000,
      totalReferrals: 2,
    },
    {
      memberId: "BO000004",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@brightorian.com",
      phone: "+2348765432109",
      sponsorId: "BO000002",
      uplineId: "BO000002",
      balance: 12000,
      totalEarnings: 28000,
      totalReferrals: 1,
    },
  ]

  for (const user of testUsers) {
    await sql`
      INSERT INTO users (
        member_id, first_name, last_name, email, phone,
        password_hash, sponsor_id, upline_id, status, role, 
        activation_date, balance, total_earnings, total_referrals
      ) VALUES (
        ${user.memberId}, ${user.firstName}, ${user.lastName}, ${user.email}, ${user.phone},
        ${hashedPassword}, ${user.sponsorId}, ${user.uplineId}, 'active', 'user',
        CURRENT_TIMESTAMP, ${user.balance}, ${user.totalEarnings}, ${user.totalReferrals}
      )
      ON CONFLICT (email) DO UPDATE SET
        password_hash = ${hashedPassword},
        balance = ${user.balance},
        total_earnings = ${user.totalEarnings},
        total_referrals = ${user.totalReferrals},
        updated_at = CURRENT_TIMESTAMP
    `
  }

  console.log("✅ Test users created!")
}

async function createSystemSettings() {
  console.log("⚙️ Creating system settings...")

  const settings = [
    { key: "package_price", value: "36000", description: "Package activation price in Naira" },
    { key: "min_withdrawal", value: "5000", description: "Minimum withdrawal amount" },
    { key: "level_1_commission", value: "4000", description: "Level 1 referral commission" },
    { key: "level_2_commission", value: "2000", description: "Level 2 referral commission" },
    { key: "level_3_commission", value: "2000", description: "Level 3 referral commission" },
    { key: "level_4_commission", value: "1500", description: "Level 4 referral commission" },
    { key: "level_5_commission", value: "1500", description: "Level 5 referral commission" },
    { key: "level_6_commission", value: "1500", description: "Level 6 referral commission" },
    { key: "max_matrix_levels", value: "6", description: "Maximum matrix levels" },
    { key: "referrals_per_level", value: "5", description: "Maximum referrals per level" },
    { key: "company_name", value: "Bright Orion", description: "Company name" },
    { key: "company_email", value: "info@brightorian.com", description: "Company email" },
    { key: "company_phone", value: "+2348000000000", description: "Company phone" },
    { key: "withdrawal_fee", value: "500", description: "Withdrawal processing fee" },
    { key: "referral_bonus", value: "1000", description: "Referral bonus amount" },
  ]

  for (const setting of settings) {
    await sql`
      INSERT INTO system_settings (setting_key, setting_value, description)
      VALUES (${setting.key}, ${setting.value}, ${setting.description})
      ON CONFLICT (setting_key) DO UPDATE SET
        setting_value = ${setting.value},
        description = ${setting.description},
        updated_at = CURRENT_TIMESTAMP
    `
  }

  console.log("✅ System settings created!")
}

async function createSampleData() {
  console.log("📊 Creating sample data...")

  // Create sample PINs
  const samplePins = [
    "PIN123456",
    "PIN789012",
    "PIN345678",
    "PIN901234",
    "PIN567890",
    "PIN111222",
    "PIN333444",
    "PIN555666",
    "PIN777888",
    "PIN999000",
  ]

  for (const pin of samplePins) {
    await sql`
      INSERT INTO activation_pins (pin, status, generated_by)
      VALUES (${pin}, 'available', 'BO000001')
      ON CONFLICT (pin) DO NOTHING
    `
  }

  // Mark some PINs as used
  await sql`
    UPDATE activation_pins 
    SET status = 'used', used_by = 'BO000002', used_at = CURRENT_TIMESTAMP 
    WHERE pin = 'PIN123456'
  `

  await sql`
    UPDATE activation_pins 
    SET status = 'used', used_by = 'BO000003', used_at = CURRENT_TIMESTAMP 
    WHERE pin = 'PIN789012'
  `

  // Create sample commissions
  const commissions = [
    { userId: "BO000001", fromUserId: "BO000002", amount: 4000, level: 1, type: "referral", status: "approved" },
    { userId: "BO000001", fromUserId: "BO000003", amount: 2000, level: 2, type: "referral", status: "approved" },
    { userId: "BO000002", fromUserId: "BO000003", amount: 4000, level: 1, type: "referral", status: "approved" },
    { userId: "BO000002", fromUserId: "BO000004", amount: 4000, level: 1, type: "referral", status: "pending" },
    { userId: "BO000001", fromUserId: "BO000004", amount: 2000, level: 2, type: "referral", status: "pending" },
  ]

  for (const commission of commissions) {
    await sql`
      INSERT INTO commissions (user_id, from_user_id, amount, level, type, status)
      VALUES (${commission.userId}, ${commission.fromUserId}, ${commission.amount}, 
              ${commission.level}, ${commission.type}, ${commission.status})
    `
  }

  // Create sample transactions
  const transactions = [
    {
      userId: "BO000002",
      type: "commission",
      amount: 4000,
      description: "Level 1 Commission from BO000003",
      reference: "COM001",
    },
    {
      userId: "BO000002",
      type: "commission",
      amount: 2000,
      description: "Level 2 Commission from BO000004",
      reference: "COM002",
    },
    {
      userId: "BO000002",
      type: "withdrawal",
      amount: -5000,
      description: "Bank Transfer to GTBank",
      reference: "WTH001",
    },
    { userId: "BO000002", type: "bonus", amount: 1000, description: "Monthly Performance Bonus", reference: "BON001" },
    {
      userId: "BO000003",
      type: "commission",
      amount: 4000,
      description: "Level 1 Commission from BO000004",
      reference: "COM003",
    },
    {
      userId: "BO000003",
      type: "payment",
      amount: 36000,
      description: "Package Activation Payment",
      reference: "PAY001",
    },
  ]

  for (const transaction of transactions) {
    await sql`
      INSERT INTO transactions (user_id, type, amount, description, reference)
      VALUES (${transaction.userId}, ${transaction.type}, ${transaction.amount}, 
              ${transaction.description}, ${transaction.reference})
    `
  }

  // Create sample payments
  const payments = [
    { userId: "BO000002", amount: 36000, reference: "pay_sample001", status: "completed" },
    { userId: "BO000003", amount: 36000, reference: "pay_sample002", status: "completed" },
    { userId: "BO000004", amount: 36000, reference: "pay_sample003", status: "pending" },
  ]

  for (const payment of payments) {
    await sql`
      INSERT INTO payments (user_id, amount, reference, status)
      VALUES (${payment.userId}, ${payment.amount}, ${payment.reference}, ${payment.status})
    `
  }

  // Create sample stockists
  const stockists = [
    {
      name: "Lagos Central Store",
      email: "lagos@brightorian.com",
      phone: "+2348111111111",
      address: "123 Lagos Island, Lagos State",
      state: "Lagos",
      lga: "Lagos Island",
      status: "active",
      stockLevel: 50,
    },
    {
      name: "Abuja Main Branch",
      email: "abuja@brightorian.com",
      phone: "+2348222222222",
      address: "456 Wuse 2, FCT Abuja",
      state: "FCT",
      lga: "Abuja Municipal",
      status: "active",
      stockLevel: 30,
    },
    {
      name: "Port Harcourt Outlet",
      email: "portharcourt@brightorian.com",
      phone: "+2348333333333",
      address: "789 GRA Phase 2, Port Harcourt",
      state: "Rivers",
      lga: "Port Harcourt",
      status: "pending",
      stockLevel: 0,
    },
  ]

  for (const stockist of stockists) {
    await sql`
      INSERT INTO stockists (name, email, phone, address, state, lga, status, stock_level)
      VALUES (${stockist.name}, ${stockist.email}, ${stockist.phone}, ${stockist.address},
              ${stockist.state}, ${stockist.lga}, ${stockist.status}, ${stockist.stockLevel})
      ON CONFLICT (email) DO UPDATE SET
        name = ${stockist.name},
        phone = ${stockist.phone},
        address = ${stockist.address},
        state = ${stockist.state},
        lga = ${stockist.lga},
        status = ${stockist.status},
        stock_level = ${stockist.stockLevel},
        updated_at = CURRENT_TIMESTAMP
    `
  }

  console.log("✅ Sample data created!")
}

// Export helper functions for production use
export async function getUser(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
  `
  return result[0] || null
}

export async function getAllUsers() {
  const result = await sql`
    SELECT * FROM users ORDER BY created_at DESC
  `
  return result
}

export async function getAllCommissions() {
  const result = await sql`
    SELECT c.*, 
           u1.first_name || ' ' || u1.last_name as user_name,
           u1.email as user_email,
           u2.first_name || ' ' || u2.last_name as from_user_name,
           u2.email as from_user_email
    FROM commissions c
    LEFT JOIN users u1 ON c.user_id = u1.member_id
    LEFT JOIN users u2 ON c.from_user_id = u2.member_id
    ORDER BY c.created_at DESC
  `
  return result
}

export async function getStats() {
  const [userStats] = await sql`
    SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_users
    FROM users
  `

  const [commissionStats] = await sql`
    SELECT 
      COUNT(*) as total_commissions,
      COALESCE(SUM(amount), 0) as total_amount,
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_commissions,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_commissions
    FROM commissions
  `

  const [pinStats] = await sql`
    SELECT 
      COUNT(*) as total_pins,
      COUNT(CASE WHEN status = 'available' THEN 1 END) as available_pins,
      COUNT(CASE WHEN status = 'used' THEN 1 END) as used_pins
    FROM activation_pins
  `

  const [stockistStats] = await sql`
    SELECT 
      COUNT(*) as total_stockists,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_stockists,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_stockists
    FROM stockists
  `

  return {
    users: userStats,
    commissions: commissionStats,
    pins: pinStats,
    stockists: stockistStats,
  }
}
