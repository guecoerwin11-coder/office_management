const prisma = require('../configs/postgres')
const Auth = require('../models/authModels')

const checkIn = async(req, res) => {
    try{

        const userId = req.user.id;

        const user = await Auth.findById(userId);

        if(!user) return res.status(401).json({
            message: 'employee not exist here'
        })

        const {employeeId, status} = req.body;

        if(!employeeId || !status){
            return res.status(400).json({
                message: 'Must required fill in'
            })
        }

        // Date.now() returns a number (epoch ms), which has no .setHours —
        // build a real Date at midnight so it matches "today" every time
        // this employee checks in
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await prisma.attendance.create({
            data: {
                employeeId: employeeId,
                date: today,
                checkIn: new Date(),
                status: status
            }
        })

        res.status(201).json({
            message: 'employee present success',
            data: attendance
        })
    }catch(err){
        // a second check-in the same day hits @@unique([employeeId, date])
        if(err.code === 'P2002'){
            return res.status(409).json({
                message: 'already checked in today'
            })
        }
        res.status(500).json({
            message: err.message
        })
    }
}

const checkOut = async(req, res) => {
    try{

        const {employeeId} = req.body;

        if(!employeeId) return res.status(400).json({
            message: 'must required this fill'
        })

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // update the same row checkIn created for (employeeId, today)
        // instead of creating a second row — employeeId_date is the
        // compound key Prisma generates from @@unique([employeeId, date])
        const attendance = await prisma.attendance.update({
            where: {
                employeeId_date: { employeeId, date: today }
            },
            data: {
                checkOut: new Date()
            }
        })

        res.status(200).json({
            message: 'employee check out',
            data: attendance
        })
    }catch(err){
        // update() throws instead of returning null when the row is
        // missing — that means there was no check-in today for this employee
        if(err.code === 'P2025'){
            return res.status(404).json({
                message: 'no check-in found for today'
            })
        }
        res.status(500).json({
            message: err.message
        })
    }
}

const getAttendanceSummary = async (req, res) => {
    try{

        // route param is :employeeId, and req.params is already the
        // object to destructure — req.params.id doesn't exist here
        const {employeeId} = req.params;

        const statusRecord = await prisma.attendance.groupBy({
            by: ["status"],
            where: {
                employeeId: employeeId
            },
            _count: {
                status: true
            }
        });

        const summary = {
            PRESENT: 0,
            ABSENT: 0,
            LATE: 0
        }

        statusRecord.forEach((item) => {
            summary[item.status] = item._count.status
        })

        // the built summary was never actually sent back before
        res.status(200).json({
            message: "Employee summary",
            data: summary
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const getEmployeeAttendance = async (req, res) => {
    try{

        // the route param is :employeeId, and req.params is already the
        // object to destructure — req.params.id doesn't exist here
        const {employeeId} = req.params;

        // findUnique needs a unique field; employeeId alone isn't one
        // (only the [employeeId, date] pair is), and findUnique can't take
        // orderBy anyway — findMany fits "attendance history" instead
        const record = await prisma.attendance.findMany({
            where: {
                employeeId: employeeId
            },
            orderBy: {
                date: 'desc'
            }
        })

        if(!record.length){
            return res.status(404).json({
                message: 'no employee record'
            })
        }
        res.status(200).json({
            message: 'employee attendance',
            data: record
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    checkIn, checkOut, 
    getAttendanceSummary, getEmployeeAttendance
}