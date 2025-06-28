import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

// Database schema creation
export const createTables = async () => {
  try {
    console.log("🚀 Creating database tables...")

    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        sponsor_id UUID REFERENCES users(id),
        upline_id UUID REFERENCES users(id),
        is_active BOOLEAN DEFAULT true,
        is_admin BOOLEAN DEFAULT false,
        total_earnings DECIMAL(12,2) DEFAULT 0,
        pending_earnings DECIMAL(12,2) DEFAULT 0,
        withdrawn_earnings DECIMAL(12,2) DEFAULT 0,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Activation pins table
    await sql`
      CREATE TABLE IF NOT EXISTS activation_pins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pin VARCHAR(50) UNIQUE NOT NULL,
        amount DECIMAL(10,2) NOT NULL DEFAULT 36000,
        is_used BOOLEAN DEFAULT false,
        used_by UUID REFERENCES users(id),
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Commissions table
    await sql`
      CREATE TABLE IF NOT EXISTS commissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        from_user_id UUID NOT NULL REFERENCES users(id),
        amount DECIMAL(10,2) NOT NULL,
        level INTEGER NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'registration',
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Payments table
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        amount DECIMAL(10,2) NOT NULL,
        reference VARCHAR(100) UNIQUE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        payment_method VARCHAR(50) NOT NULL,
        gateway_response JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Withdrawals table
    await sql`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        amount DECIMAL(10,2) NOT NULL,
        bank_name VARCHAR(100) NOT NULL,
        account_number VARCHAR(20) NOT NULL,
        account_name VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        processed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Stockists table
    await sql`
      CREATE TABLE IF NOT EXISTS stockists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        business_name VARCHAR(255) NOT NULL,
        business_address TEXT NOT NULL,
        business_phone VARCHAR(20) NOT NULL,
        business_email VARCHAR(255) NOT NULL,
        bank_name VARCHAR(100) NOT NULL,
        account_number VARCHAR(20) NOT NULL,
        account_name VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    console.log("✅ Database tables created successfully")
    return true
  } catch (error) {
    console.error("❌ Error creating tables:", error)
    throw error
  }
}

// Seed sample data
export const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database with sample data...")

    // Create admin user
    const adminPassword = await bcrypt.hash("BrightAdmin2024!", 10)
    const adminResult = await sql`
      INSERT INTO users (
        member_id, email, password, first_name, last_name, phone,
        is_active, is_admin, location
      ) VALUES (
        'BO000001', 'admin@brightorian.com', ${adminPassword}, 'System', 'Administrator',
        '+2348123456789', true, true, 'Lagos, Nigeria'
      ) 
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `

    // Create sample users
    const userPassword = await bcrypt.hash("BrightUser2024!", 10)

    const user1Result = await sql`
      INSERT INTO users (
        member_id, email, password, first_name, last_name, phone,
        sponsor_id, is_active, total_earnings, pending_earnings, withdrawn_earnings, location
      ) VALUES (
        'BO000002', 'john.doe@brightorian.com', ${userPassword}, 'John', 'Doe',
        '+2348123456790', ${adminResult[0]?.id}, true, 125000, 25000, 100000, 'Lagos, Nigeria'
      )
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `

    const user2Result = await sql`
      INSERT INTO users (
        member_id, email, password, first_name, last_name, phone,
        sponsor_id, upline_id, is_active, total_earnings, pending_earnings, withdrawn_earnings, location
      ) VALUES (
        'BO000003', 'jane.smith@brightorian.com', ${userPassword}, 'Jane', 'Smith',
        '+2348123456791', ${user1Result[0]?.id}, ${user1Result[0]?.id}, true, 85000, 15000, 70000, 'Abuja, Nigeria'
      )
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `

    const user3Result = await sql`
      INSERT INTO users (
        member_id, email, password, first_name, last_name, phone,
        sponsor_id, upline_id, is_active, total_earnings, pending_earnings, withdrawn_earnings, location
      ) VALUES (
        'BO000004', 'mike.johnson@brightorian.com', ${userPassword}, 'Mike', 'Johnson',
        '+2348123456792', ${user1Result[0]?.id}, ${user1Result[0]?.id}, true, 65000, 12000, 53000, 'Port Harcourt, Nigeria'
      )
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `

    const user4Result = await sql`
      INSERT INTO users (
        member_id, email, password, first_name, last_name, phone,
        sponsor_id, upline_id, is_active, total_earnings, pending_earnings, withdrawn_earnings, location
      ) VALUES (
        'BO000005', 'sarah.williams@brightorian.com', ${userPassword}, 'Sarah', 'Williams',
        '+2348123456793', ${user2Result[0]?.id}, ${user2Result[0]?.id}, true, 45000, 8000, 37000, 'Kano, Nigeria'
      )
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `

    // Create activation pins
    const pins = [
      "BRIGHT2024001",
      "BRIGHT2024002",
      "BRIGHT2024003",
      "BRIGHT2024004",
      "BRIGHT2024005",
      "BRIGHT2024006",
      "BRIGHT2024007",
      "BRIGHT2024008",
      "BRIGHT2024009",
      "BRIGHT2024010",
    ]

    for (let i = 0; i < pins.length; i++) {
      const isUsed = i < 4 // First 4 pins are used
      const usedBy = isUsed ? [user1Result[0]?.id, user2Result[0]?.id, user3Result[0]?.id, user4Result[0]?.id][i] : null

      await sql`
        INSERT INTO activation_pins (pin, amount, is_used, used_by, used_at)
        VALUES (${pins[i]}, 36000, ${isUsed}, ${usedBy}, ${isUsed ? new Date() : null})
        ON CONFLICT (pin) DO NOTHING
      `
    }

    // Create sample commissions
    if (adminResult[0]?.id && user1Result[0]?.id) {
      await sql`
        INSERT INTO commissions (user_id, from_user_id, amount, level, type, status, description)
        VALUES 
          (${adminResult[0].id}, ${user1Result[0].id}, 4000, 1, 'registration', 'approved', 'Level 1 commission from John Doe registration'),
          (${user1Result[0].id}, ${user2Result[0]?.id}, 4000, 1, 'registration', 'approved', 'Level 1 commission from Jane Smith registration'),
          (${user1Result[0].id}, ${user3Result[0]?.id}, 4000, 1, 'registration', 'pending', 'Level 1 commission from Mike Johnson registration'),
          (${adminResult[0].id}, ${user2Result[0]?.id}, 2000, 2, 'registration', 'approved', 'Level 2 commission from Jane Smith registration')
        ON CONFLICT DO NOTHING
      `
    }

    // Create sample stockist
    if (user1Result[0]?.id) {
      await sql`
        INSERT INTO stockists (
          user_id, business_name, business_address, business_phone, business_email,
          bank_name, account_number, account_name, status
        ) VALUES (
          ${user1Result[0].id}, 'John Electronics Store', '123 Lagos Street, Victoria Island, Lagos',
          '+2348123456790', 'john.electronics@gmail.com', 'First Bank', '1234567890', 'John Doe', 'approved'
        )
        ON CONFLICT DO NOTHING
      `
    }

    console.log("✅ Database seeded successfully")
    return true
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  }
}

// User functions
export const findUserByEmail = async (email: string) => {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
  `
  return result[0] || null
}

export const findUserById = async (id: string) => {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id} LIMIT 1
  `
  return result[0] || null
}

export const createUser = async (userData: any) => {
  const memberIdNumber = Date.now().toString().slice(-6)
  const memberId = `BO${memberIdNumber}`

  const result = await sql`
    INSERT INTO users (
      member_id, email, password, first_name, last_name, phone,
      sponsor_id, upline_id, location
    ) VALUES (
      ${memberId}, ${userData.email}, ${userData.password}, ${userData.firstName}, ${userData.lastName},
      ${userData.phone}, ${userData.sponsorId}, ${userData.uplineId}, ${userData.location}
    ) RETURNING *
  `
  return result[0]
}

export const getAllUsers = async () => {
  const result = await sql`
    SELECT 
      u.*,
      s.first_name || ' ' || s.last_name as sponsor_name,
      up.first_name || ' ' || up.last_name as upline_name
    FROM users u
    LEFT JOIN users s ON u.sponsor_id = s.id
    LEFT JOIN users up ON u.upline_id = up.id
    ORDER BY u.created_at DESC
  `
  return result
}

export const getAllCommissions = async () => {
  const result = await sql`
    SELECT 
      c.*,
      u.first_name || ' ' || u.last_name as user_name,
      u.member_id as user_member_id,
      fu.first_name || ' ' || fu.last_name as from_user_name,
      fu.member_id as from_user_member_id
    FROM commissions c
    JOIN users u ON c.user_id = u.id
    JOIN users fu ON c.from_user_id = fu.id
    ORDER BY c.created_at DESC
  `
  return result
}

export const getStats = async () => {
  const totalUsers = await sql`SELECT COUNT(*) as count FROM users WHERE is_admin = false`
  const activeUsers = await sql`SELECT COUNT(*) as count FROM users WHERE is_active = true AND is_admin = false`
  const totalCommissions =
    await sql`SELECT COALESCE(SUM(amount), 0) as total FROM commissions WHERE status = 'approved'`
  const pendingCommissions = await sql`SELECT COUNT(*) as count FROM commissions WHERE status = 'pending'`
  const totalPins = await sql`SELECT COUNT(*) as count FROM activation_pins`
  const usedPins = await sql`SELECT COUNT(*) as count FROM activation_pins WHERE is_used = true`

  return {
    totalUsers: Number.parseInt(totalUsers[0].count),
    activeUsers: Number.parseInt(activeUsers[0].count),
    totalCommissions: Number.parseFloat(totalCommissions[0].total),
    pendingCommissions: Number.parseInt(pendingCommissions[0].count),
    totalPins: Number.parseInt(totalPins[0].count),
    usedPins: Number.parseInt(usedPins[0].count),
    availablePins: Number.parseInt(totalPins[0].count) - Number.parseInt(usedPins[0].count),
  }
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10)
}
