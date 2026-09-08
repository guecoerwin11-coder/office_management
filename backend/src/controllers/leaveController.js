const prisma = require('../configs/postgres');
const Auth = require('../models/authModels');

        //query status should like this leaves?status=PENDING
        const ALLOWED_STATUS = ['PENDING', 'APPROVED', 'REJECTED'];

        //
        const ALLOWED_TYPE = ['SICK', 'CASUAL', 'ANNUAL']

const requestLeave = async (req, res) => {
    try{

        const { employeeId, type, startDate, endDate, reason } = req.body;

        //check if the fields is empty
        if(!employeeId || !startDate ||!endDate || !reason){
            return res.status(400).json({
                message: 'required fill it'
            })
        }

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

        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    requestLeave, getRequestLeave, approveLeave,
    deleteLeave
}