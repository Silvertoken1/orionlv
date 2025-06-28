import bcrypt from "bcryptjs"

// Types
export interface User {
  id: string
  memberId: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  sponsorId?: string
  isActive: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
  totalEarnings: number
  pendingEarnings: number
  withdrawnEarnings: number
}

export interface Commission {
  id: string
  userId: string
  fromUserId: string
  amount: number
  level: number
  type: "registration" | "matrix" | "bonus"
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
  description: string
}

export interface ActivationPin {
  id: string
  pin: string
  isUsed: boolean
  usedBy?: string
  createdAt: Date
  usedAt?: Date
  amount: number
}

export interface Payment {
  id: string
  userId: string
  amount: number
  reference: string
  status: "pending" | "success" | "failed"
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

// In-memory storage
let users: User[] = []
let commissions: Commission[] = []
let activationPins: ActivationPin[] = []
const payments: Payment[] = []

// Initialize with sample data
const initializeData = () => {
  if (users.length === 0) {
    console.log("🚀 Initializing database with sample data...")

    try {
      // Create admin user with proper password hashing
      const adminPassword = bcrypt.hashSync("Admin123!", 10)
      const userPassword = bcrypt.hashSync("User123!", 10)

      const adminUser: User = {
        id: "admin-001",
        memberId: "BO000001",
        email: "admin@brightorian.com",
        password: adminPassword,
        firstName: "System",
        lastName: "Administrator",
        phone: "+2348123456789",
        isActive: true,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalEarnings: 0,
        pendingEarnings: 0,
        withdrawnEarnings: 0,
      }

      const sampleUser: User = {
        id: "user-001",
        memberId: "BO000002",
        email: "john.doe@brightorian.com",
        password: userPassword,
        firstName: "John",
        lastName: "Doe",
        phone: "+2348123456790",
        sponsorId: "admin-001",
        isActive: true,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalEarnings: 25000,
        pendingEarnings: 8000,
        withdrawnEarnings: 17000,
      }

      const testUser2: User = {
        id: "user-002",
        memberId: "BO000003",
        email: "jane.smith@brightorian.com",
        password: userPassword,
        firstName: "Jane",
        lastName: "Smith",
        phone: "+2348123456791",
        sponsorId: "user-001",
        isActive: true,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalEarnings: 12000,
        pendingEarnings: 3000,
        withdrawnEarnings: 9000,
      }

      const testUser3: User = {
        id: "user-003",
        memberId: "BO000004",
        email: "mike.johnson@brightorian.com",
        password: userPassword,
        firstName: "Mike",
        lastName: "Johnson",
        phone: "+2348123456792",
        sponsorId: "user-001",
        isActive: true,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalEarnings: 8500,
        pendingEarnings: 2500,
        withdrawnEarnings: 6000,
      }

      users = [adminUser, sampleUser, testUser2, testUser3]

      console.log("✅ Sample users created successfully:")
      console.log("👤 Admin:", adminUser.email, "/ Admin123!")
      console.log("👤 User 1:", sampleUser.email, "/ User123!")
      console.log("👤 User 2:", testUser2.email, "/ User123!")
      console.log("👤 User 3:", testUser3.email, "/ User123!")

      // Test password verification
      const testAdmin = bcrypt.compareSync("Admin123!", adminPassword)
      const testUser = bcrypt.compareSync("User123!", userPassword)
      console.log("🔑 Password verification test - Admin:", testAdmin, "User:", testUser)
    } catch (error) {
      console.error("❌ Error initializing users:", error)
    }

    // Create sample activation pins
    activationPins = [
      {
        id: "pin-001",
        pin: "BRIGHT2024001",
        isUsed: false,
        amount: 36000,
        createdAt: new Date(),
      },
      {
        id: "pin-002",
        pin: "BRIGHT2024002",
        isUsed: true,
        usedBy: "user-001",
        amount: 36000,
        createdAt: new Date(),
        usedAt: new Date(),
      },
      {
        id: "pin-003",
        pin: "BRIGHT2024003",
        isUsed: false,
        amount: 36000,
        createdAt: new Date(),
      },
    ]

    // Create sample commissions
    commissions = [
      {
        id: "comm-001",
        userId: "admin-001",
        fromUserId: "user-001",
        amount: 4000,
        level: 1,
        type: "registration",
        status: "approved",
        description: "Level 1 commission from John Doe registration",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "comm-002",
        userId: "user-001",
        fromUserId: "user-002",
        amount: 4000,
        level: 1,
        type: "registration",
        status: "approved",
        description: "Level 1 commission from Jane Smith registration",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    console.log("✅ Database initialization complete")
    console.log("📊 Stats:", {
      users: users.length,
      pins: activationPins.length,
      commissions: commissions.length,
    })
  }
}

// Hash password function
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10)
}

// Verify password function
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(password, hashedPassword)
    console.log("🔐 Password comparison result:", result)
    return result
  } catch (error) {
    console.error("❌ Password verification error:", error)
    return false
  }
}

// User functions
export const createUser = async (userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> => {
  initializeData()

  const user: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  users.push(user)
  console.log("✅ New user created:", user.email)
  return user
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  initializeData()
  const normalizedEmail = email.toLowerCase().trim()
  const user = users.find((user) => user.email.toLowerCase() === normalizedEmail)
  console.log("🔍 Finding user by email:", normalizedEmail, "Found:", !!user)
  return user || null
}

export const findUserById = async (id: string): Promise<User | null> => {
  initializeData()
  return users.find((user) => user.id === id) || null
}

export const findUserByMemberId = async (memberId: string): Promise<User | null> => {
  initializeData()
  return users.find((user) => user.memberId === memberId) || null
}

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  initializeData()
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return null

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date(),
  }

  return users[userIndex]
}

export const getAllUsers = async (): Promise<User[]> => {
  initializeData()
  return users
}

// Commission functions
export const createCommission = async (
  commissionData: Omit<Commission, "id" | "createdAt" | "updatedAt">,
): Promise<Commission> => {
  initializeData()

  const commission: Commission = {
    ...commissionData,
    id: `comm-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  commissions.push(commission)
  return commission
}

export const getCommissionsByUserId = async (userId: string): Promise<Commission[]> => {
  initializeData()
  return commissions.filter((commission) => commission.userId === userId)
}

export const getAllCommissions = async (): Promise<Commission[]> => {
  initializeData()
  return commissions
}

export const updateCommissionStatus = async (id: string, status: Commission["status"]): Promise<Commission | null> => {
  initializeData()
  const commissionIndex = commissions.findIndex((commission) => commission.id === id)
  if (commissionIndex === -1) return null

  commissions[commissionIndex] = {
    ...commissions[commissionIndex],
    status,
    updatedAt: new Date(),
  }

  return commissions[commissionIndex]
}

// Activation Pin functions
export const createActivationPin = async (pinData: Omit<ActivationPin, "id" | "createdAt">): Promise<ActivationPin> => {
  initializeData()

  const pin: ActivationPin = {
    ...pinData,
    id: `pin-${Date.now()}`,
    createdAt: new Date(),
  }

  activationPins.push(pin)
  return pin
}

export const findActivationPin = async (pin: string): Promise<ActivationPin | null> => {
  initializeData()
  return activationPins.find((p) => p.pin === pin) || null
}

export const useActivationPin = async (pin: string, userId: string): Promise<ActivationPin | null> => {
  initializeData()
  const pinIndex = activationPins.findIndex((p) => p.pin === pin && !p.isUsed)
  if (pinIndex === -1) return null

  activationPins[pinIndex] = {
    ...activationPins[pinIndex],
    isUsed: true,
    usedBy: userId,
    usedAt: new Date(),
  }

  return activationPins[pinIndex]
}

export const getAllActivationPins = async (): Promise<ActivationPin[]> => {
  initializeData()
  return activationPins
}

// Payment functions
export const createPayment = async (paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> => {
  initializeData()

  const payment: Payment = {
    ...paymentData,
    id: `pay-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  payments.push(payment)
  return payment
}

export const findPaymentByReference = async (reference: string): Promise<Payment | null> => {
  initializeData()
  return payments.find((payment) => payment.reference === reference) || null
}

export const updatePaymentStatus = async (id: string, status: Payment["status"]): Promise<Payment | null> => {
  initializeData()
  const paymentIndex = payments.findIndex((payment) => payment.id === id)
  if (paymentIndex === -1) return null

  payments[paymentIndex] = {
    ...payments[paymentIndex],
    status,
    updatedAt: new Date(),
  }

  return payments[paymentIndex]
}

// Statistics functions
export const getStats = async () => {
  initializeData()

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.isActive).length
  const totalCommissions = commissions.reduce((sum, comm) => sum + comm.amount, 0)
  const pendingCommissions = commissions.filter((comm) => comm.status === "pending").length
  const approvedCommissions = commissions.filter((comm) => comm.status === "approved").length
  const totalPins = activationPins.length
  const usedPins = activationPins.filter((pin) => pin.isUsed).length
  const availablePins = totalPins - usedPins

  return {
    totalUsers,
    activeUsers,
    totalCommissions,
    pendingCommissions,
    approvedCommissions,
    totalPins,
    usedPins,
    availablePins,
  }
}

// Initialize data on module load
initializeData()
