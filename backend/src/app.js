const express = require('express')
const app = express()
const authRouter = require('../src/routes/authRoutes')
const deptRouter = require('./routes/departmentRoute')
app.use(express.json())

app.use("/api", authRouter);
app.use("/api", deptRouter)

module.exports = app;