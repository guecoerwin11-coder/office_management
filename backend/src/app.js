const express = require('express')
const app = express()
const authRouter = require('../src/routes/authRoutes')

app.use(express.json())

app.use("api", authRouter);

module.exports = app;