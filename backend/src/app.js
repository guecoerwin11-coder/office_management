const express = require('express')
const app = express()
const authRouter = require('../src/routes/authRoutes')
const deptRouter = require('./routes/departmentRoute')
const empRouter = require('./routes/employeeRoute')
const attndRouter = require('./routes/attendanceRoute')
const leaveRouter = require('./routes/leaveRoute')
const annouceRouter = require('./routes/annouceRoute')
app.use(express.json())

app.use("/api", authRouter);
app.use("/api", deptRouter)
app.use("/api", empRouter)
app.use("/api", attndRouter)
app.use("/api", leaveRouter)
app.use("/api", annouceRouter)

module.exports = app;