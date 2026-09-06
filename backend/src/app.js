const express = require('express')
const app = express()
const authRouter = require('../src/routes/authRoutes')
const deptRouter = require('./routes/departmentRoute')
const empRouter = require('./routes/employeeRoute')
app.use(express.json())

app.use("/api", authRouter);
app.use("/api", deptRouter)
app.use("/api", empRouter)

module.exports = app;