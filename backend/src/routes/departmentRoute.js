const express = require('express')
const deptRouter = express.Router();
const {
    getRoles, addDepartment,
    updateManager, getDepartments, removeDepartment
} = require('../controllers/departmentController')
const isAuthorized = require("../middleware/isAuthorized")
const protect = require('../middleware/protect')

deptRouter.get('/admin', protect, isAuthorized, getRoles)

deptRouter.post('/admin', protect, isAuthorized, addDepartment)

deptRouter.get('/departments', protect, getDepartments)

// :id is the department's own id, not the manager's id
deptRouter.put('/admin/:id', protect, isAuthorized, updateManager)

deptRouter.delete('/admin/:id', protect, isAuthorized, removeDepartment)

module.exports= deptRouter