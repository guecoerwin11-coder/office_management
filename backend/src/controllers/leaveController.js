const prisma = require('../configs/postgres');
const Auth = require('../models/authModels');

const requestLeave = async (req, res) => {
    try{

        const userId = req.user.id;

        // findById takes the raw id directly, not a filter object like { userId }
        const user = await Auth.findById(userId);

        if(!user){
            return res.status(401).json({
                message: 'no user found'
            })
        }

        const { employeeId, type, startDate, endDate, reason } = req.body;

        // startDate was missing from this check even though the schema
        // requires it — omitting it used to fail with a raw Prisma error
        if(!employeeId || !type || !startDate || !endDate || !reason){
            return res.status(400).json({
                message: 'required fill it'
            })
        }

        // confirm the employee actually exists before writing, same
        // pattern used in employeeController.addEmployee — avoids an
        // unhandled foreign-key error from a bad employeeId
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId }
        });

        if(!employee){
            return res.status(404).json({
                message: 'employee not existed'
            })
        }

        // status defaults to PENDING and reviewBy stays empty until an
        // admin/manager actually reviews this — neither is set here
        const leave = await prisma.leaveRequest.create({
            data: {
                employeeId: employeeId,
                type: type,
                startDate: startDate,
                endDate: endDate,
                reason: reason
            }
        })

        res.status(201).json({
            message: 'Leave request posted, waiting for the approval',
            data: leave
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const getRequestLeave = async (req, res) =>{
    try{

        const leave = await prisma.leaveRequest.findMany({
            orderBy: { createdAt: 'desc' }
        })

        // this response was missing entirely before — the request just
        // hung with no reply on the success path
        res.status(200).json({
            message: 'leave request list',
            data: leave
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const approveLeave = async (req, res) => {
    try{

        const leaveId = req.params.id;
        const { status } = req.body;

        if(!['APPROVED', 'REJECTED'].includes(status)){
            return res.status(400).json({
                message: 'status must be APPROVED or REJECTED'
            })
        }

        const existing = await prisma.leaveRequest.findUnique({
            where: { id: leaveId }
        });

        if(!existing){
            return res.status(404).json({
                message: 'leave request not existed'
            })
        }

        // req.user.id is the admin/manager approving this — recorded as
        // the reviewer rather than trusting a reviewBy value from the body
        const leave = await prisma.leaveRequest.update({
            where: { id: leaveId },
            data: {
                status,
                reviewBy: req.user.id
            }
        });

        res.status(200).json({
            message: `leave request ${status.toLowerCase()}`,
            data: leave
        })
    }catch(err){
        // update() throws instead of returning null when the row is missing
        if(err.code === 'P2025'){
            return res.status(404).json({
                message: 'leave request not existed'
            })
        }
        res.status(500).json({
            message: err.message
        })
    }
}

const deleteLeave = async (req, res) => {
    try{

        const leaveId = req.params.id;

        // delete() throws (doesn't return null) when the row is missing,
        // so existence is checked first, same as departmentController
        const existing = await prisma.leaveRequest.findUnique({
            where: { id: leaveId }
        });

        if(!existing){
            return res.status(404).json({
                message: 'leave request not existed'
            })
        }

        await prisma.leaveRequest.delete({
            where: { id: leaveId }
        });

        res.status(200).json({
            message: 'leave request deleted'
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = { requestLeave, getRequestLeave, approveLeave, deleteLeave }
