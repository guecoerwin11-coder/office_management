const prisma = require('../configs/postgres');
const Auth = require('../models/authModels');

const requestLeave = async (req, res) => {
        const userId = req.user.id;

        const user = await Auth.findById({userId});

        if(!user){
            return res.status(401).json({
                message: 'no user found'
            })
        }

    try{

        const { employeeId, type, startDate, endDate, reason, status } = req.body;

        if(!employeeId || !type || !endDate || !reason){
            return res.status(400).json({
                message: 'required fill it'
            })
        }

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
            data: {
                status: leave.status
            }
        })
    }catch(err){
        if(err.code == 'p2025'){
            return res.status(404).json({
                message: 'no leave available today'
            })
        }

        res.status(500).json({
            message: err.message
        })
    }
}

const getRequestLeave = async (req, res) =>{
    try{

        const leave = await prisma.leaveRequest.findMany({
            
        })
    }catch(err){
        if(err.code === 'p2025'){
            return res.status(400).json({
                message: 'not leave request found'
            })
        }

        res.status(500).json({
            message: err.message
        })
    }
}