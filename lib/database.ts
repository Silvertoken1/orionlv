import bcrypt from "bcryptjs"

// Types
export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  memberId: string
  sponsorId?: string
  role: "admin" | "user"
  status: "active" | "inactive" | "suspended"
  balance: number
  totalEarnings: number
  createdAt: Date
  updatedAt: Date
}

export interface Commission {
  id: string
  userId: string
  fromUserId: string
  amount: number
  level: number
  type: "registration" | "matrix" | "bonus"
  status: "pending" | "approved" | "rejected"
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  userId: string
  amount: number
  type: "registration" | "upgrade" | "withdrawal"
  status: "pending" | "completed" | "failed"
  reference: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface ActivationPin {
  id: string
  pin: string
  amount: number
  status: "active" | "used" | "expired"
  usedBy?: string
  createdBy: string
  createdAt: Date
  usedAt?: Date
}

export interface Stockist {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  businessName: string
  address: string
  city: string
  state: string
  status: "pending" | "approved" | "suspended"
  stockLevel: number
  totalSales: number
  commission: number
  createdAt: Date
  updatedAt: Date
}

// In-memory database
const database = {
  users: new Map<string, User>(),
  commissions: new Map<string, Commission>(),
  payments: new Map<string, Payment>(),
  activationPins: new Map<string, ActivationPin>(),
  stockists: new Map<string, Stockist>(),
}

// Initialize with sample data
async function initializeDatabase() {
  if (database.users.size > 0) return

  const adminPassword = await bcrypt.hash("Admin123!", 10)
  const userPassword = await bcrypt.hash("User123!", 10)

  // Admin user
  const admin: User = {
    id: "admin-1",
    email: "admin@brightorian.com",
    password: adminPassword,
    firstName: "Admin",
    lastName: "User",
    phone: "+2348123456789",
    memberId: "ADM001",
    role: "admin",
    status: "active",
    balance: 0,
    totalEarnings: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Regular user
  const user: User = {
    id: "user-1",
    email: "john.doe@brightorian.com",
    password: userPassword,
    firstName: "John",
    lastName: "Doe",
    phone: "+2348123456790",
    memberId: "USR001",
    sponsorId: "admin-1",
    role: "user",
    status: "active",
    balance: 5000,
    totalEarnings: 15000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  database.users.set(admin.id, admin)
  database.users.set(user.id, user)

  // Sample commission
  const commission: Commission = {
    id: "comm-1",
    userId: "user-1",
    fromUserId: "user-2",
    amount: 2500,
    level: 1,
    type: "registration",
    status: "approved",
    description: "Registration commission from new member",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  database.commissions.set(commission.id, commission)

  // Sample payment
  const payment: Payment = {
    id: "pay-1",
    userId: "user-1",
    amount: 10000,
    type: "registration",
    status: "completed",
    reference: "REF123456789",
    description: "Registration payment",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  database.payments.set(payment.id, payment)

  // Sample activation pin
  const pin: ActivationPin = {
    id: "pin-1",
    pin: "PIN123456",
    amount: 10000,
    status: "active",
    createdBy: "admin-1",
    createdAt: new Date(),
  }

  database.activationPins.set(pin.id, pin)
}

// Initialize database
initializeDatabase()

// Database instance
export const db = database

// Get database function
export function getDatabase() {
  return database
}

// User functions
export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const user: User = {
    ...userData,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  database.users.set(id, user)
  return user
}

export function findUserByEmail(email: string): User | undefined {
  return Array.from(database.users.values()).find((user) => user.email === email)
}

export function findUserById(id: string): User | undefined {
  return database.users.get(id)
}

export function findUserByMemberId(memberId: string): User | undefined {
  return Array.from(database.users.values()).find((user) => user.memberId === memberId)
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const user = database.users.get(id)
  if (!user) return null

  const updatedUser = { ...user, ...updates, updatedAt: new Date() }
  database.users.set(id, updatedUser)
  return updatedUser
}

export function getAllUsers(): User[] {
  return Array.from(database.users.values())
}

// Commission functions
export function createCommission(commissionData: Omit<Commission, "id" | "createdAt" | "updatedAt">): Commission {
  const id = `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const commission: Commission = {
    ...commissionData,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  database.commissions.set(id, commission)
  return commission
}

export function findCommissionsByUserId(userId: string): Commission[] {
  return Array.from(database.commissions.values()).filter((comm) => comm.userId === userId)
}

export function updateCommissionStatus(id: string, status: Commission["status"]): Commission | null {
  const commission = database.commissions.get(id)
  if (!commission) return null

  const updatedCommission = { ...commission, status, updatedAt: new Date() }
  database.commissions.set(id, updatedCommission)
  return updatedCommission
}

export function getAllCommissions(): Commission[] {
  return Array.from(database.commissions.values())
}

// Payment functions
export function createPayment(paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">): Payment {
  const id = `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const payment: Payment = {
    ...paymentData,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  database.payments.set(id, payment)
  return payment
}

export function findPaymentsByUserId(userId: string): Payment[] {
  return Array.from(database.payments.values()).filter((payment) => payment.userId === userId)
}

export function getAllPayments(): Payment[] {
  return Array.from(database.payments.values())
}

// Activation Pin functions
export function createActivationPin(pinData: Omit<ActivationPin, "id" | "createdAt">): ActivationPin {
  const id = `pin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const pin: ActivationPin = {
    ...pinData,
    id,
    createdAt: new Date(),
  }
  database.activationPins.set(id, pin)
  return pin
}

export function findActivationPinByPin(pin: string): ActivationPin | undefined {
  return Array.from(database.activationPins.values()).find((p) => p.pin === pin)
}

export function getAllActivationPins(): ActivationPin[] {
  return Array.from(database.activationPins.values())
}

// Stockist functions
export function createStockist(stockistData: Omit<Stockist, "id" | "createdAt" | "updatedAt">): Stockist {
  const id = `stockist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const stockist: Stockist = {
    ...stockistData,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  database.stockists.set(id, stockist)
  return stockist
}

export function findStockistByEmail(email: string): Stockist | undefined {
  return Array.from(database.stockists.values()).find((stockist) => stockist.email === email)
}

export function getAllStockists(): Stockist[] {
  return Array.from(database.stockists.values())
}

export function updateStockist(id: string, updates: Partial<Stockist>): Stockist | null {
  const stockist = database.stockists.get(id)
  if (!stockist) return null

  const updatedStockist = { ...stockist, ...updates, updatedAt: new Date() }
  database.stockists.set(id, updatedStockist)
  return updatedStockist
}

// Utility functions
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Export collections for direct access
export const users = database.users
export const commissions = database.commissions
export const payments = database.payments
export const activationPins = database.activationPins
export const stockists = database.stockists
