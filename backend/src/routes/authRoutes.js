const express = require('express')
const authRouter = express.Router()
const {registerSchema, loginSchema} = require('../schema/authSchema');
const {passwordResetEmail} = require("../services/passwordEmail")
const {
    register, login, forgotPassword, resetPassword
} = require('../controllers/authController')
const validation = require('../middleware/validation')

authRouter.post("/register", validation(registerSchema), register)
authRouter.post("/login", validation(loginSchema), login)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)

module.exports = authRouter;