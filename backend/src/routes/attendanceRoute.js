const express = require('express');
const attndRouter = express.Router();
const protect = require('../middleware/protect')
const {
    checkIn, checkOut, 
    getAttendanceSummary, getEmployeeAttendance
} = require("../controllers/attendanceController")
const isAuthorized = require("../middleware/isAuthorized");

attndRouter.post('/check-in', protect, checkIn)
attndRouter.post('/check-out', protect, checkOut)

//get attendance by manager
// isAuthorized is a factory now — it needs the allowed roles passed in,
// otherwise Express calls it with (req, res, next) directly and it breaks
attndRouter.get('/attendance/:employeeId', protect, isAuthorized(['admin', 'manager']), getEmployeeAttendance)
attndRouter.get('/attendance/:employeeId/summary', protect, isAuthorized(['admin', 'manager']), getAttendanceSummary)

module.exports = attndRouter