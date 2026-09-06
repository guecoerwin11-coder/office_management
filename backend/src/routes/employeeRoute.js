const express = require('express')
const empRouter = express.Router()
const { addEmployee } = require('../controllers/employeeController')
const protect = require('../middleware/protect')
const isAuthorized = require('../middleware/isAuthorized')

empRouter.post('/employees', protect, isAuthorized(['admin', 'manager']), addEmployee)

module.exports = empRouter
