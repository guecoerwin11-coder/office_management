const prisma = require('../configs/postgres');
const Auth = require('../models/authModels');

        //query status should like this leaves?status=PENDING
        const ALLOWED_STATUS = ['PENDING', 'APPROVED', 'REJECTED'];

        //
        const ALLOWED_TYPE = ['SICK', 'CASUAL', 'ANNUAL']

const requestLeave = async (req, res) => {
    try{
<<<<<<< HEAD

        const { employeeId, type, startDate, endDate, reason } = req.body;

        //check if the fields is empty
        if(!employeeId || !startDate ||!endDate || !reason){
=======

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
>>>>>>> feature/annoucement-controller
            return res.status(400).json({
                message: 'required fill it'
            })
        }

<<<<<<< HEAD
        if(!ALLOWED_TYPE.includes(type)) return res.status(400).json({
            message: `Invalid leave Type.`
        })


        //store a date realtime
        const strt = new Date(startDate);
        const end = new Date(endDate);

        //check if the start is after the end
        if(strt > end) return res.status(400).json({
            message: 'Start date cannot be after the end date'
        });

        const overlappingLeave = await prisma.leaveRequest.findFirst({
            where: {
                employeeId, 
                status: {in: ['PENDING', 'APPROVED']},
                startDate: {lte: end},
                endDate: {gte: start}
            }
        });

        if(overlappingLeave){
            return res.status(400).json({
                message: 'already had a request leave, wait for the approval request'
            })
        }

        const leave = await prisma.leaveRequest.create({
            data:{
                employeeId,
                type,
                startDate: start,
                endDate: end,
                reason,
                reviewBy: 'Pending_ Review'
            }
        })

        return res.status(201).json({ success: true, data: leaveRequest });
        
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const getRequestLeave = async (req, res) => {
    try{
        
        //check the query 
        const { status } = req.query;
        
        
        //temporary store the status inputed
        const filterConditions = {};

        //if you query the status only
        if(status){
            const upperStatus = status.toUpperCase();
            if(!ALLOWED_STATUS.includes(upperStatus)){
                return res.status(400).json({
                    message: 'Invalid Status type input'
                })
            }

            filterConditions.status = upperStatus
        }

        const leaves = await prisma.leaveRequest.findMany({
            where: filterConditions,
            select: {
                employeeId: true,
                type,
                startDate,
                endDate,
                reason,
                reviewBy
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves
        })
        
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const approveLeave = async (req, res) => {
    try{
        const { id } = req.params;
        const {status, reviewby} = req.body;

        if(!ALLOWED_STATUS.includes(status)){
            return res.status(400).json({
                message: 'Invalid Status.'
            })
        }

        const updateLeave = await prisma.leaveRequest.update({
            where: {
                id
            },
            data:{
                status,
                reviewBy
            }
        });

        res.status(200).json({
            message: 'leave request updated'
        })
    }catch(err){
        if(err.code === 'p2025') return res.status(400).json({
            message: 'not leave request found'
        })
    }
}

const deleteLeave = async (req, res) => {
    try{

        const {id} = req.params;

        const leave = await prisma.leaveRequest.delete({
            where: {
                id
            }
        })

        res.status(200).json({
            message:'leave request deleted'
        })
    }catch(err){
        if(err.code === 'p2025'){
            return res.status(400).json({
                message: 'no leave request found'
            })
        }

=======
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
>>>>>>> feature/annoucement-controller
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

