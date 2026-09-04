const z = require('zod')

const registerSchema = new z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string().min(6).max(32),
    role: z.enum(["admin", "manager", "employee"]).optional()
})

const loginSchema = new z.object({
    email: z.string().email(),
    password: z.string().min(6).max(32)
})

module.exports = {
    registerSchema, loginSchema
}