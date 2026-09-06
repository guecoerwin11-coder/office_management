const prisma = require('../configs/postgres');
const Auth = require('../models/authModels');

const getEmployee = async(req, res) => {
    try{
        const { role } = req.query;

        const query = role ? {
            role: role.lowerCase()
        } : {};

        const users = await Auth.find(query);

        res.status(200).json({
            message: {
                id: users.userId,
                fullName: users.fullName,
                position: user.position
            }
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const addEmployee = async (req, res) => {
    try{

        const { userId, fullName, position, departmentId } = req.body;

        if(!userId || !fullName || !position || !departmentId){
            return res.status(400).json({
                message: 'userId, fullName, position and departmentId are required'
            })
        }

        const authUser = await Auth.findById(userId);

        if(!authUser){
            return res.status(404).json({
                message: 'user is not existed'
            })
        }

        const department = await prisma.department.findUnique({
            where: { id: departmentId }
        });

        if(!department){
            return res.status(404).json({
                message: 'department is not existed'
            })
        }

        // a manager may only add employees into the department they manage;
        // an admin can add into any department
        if(req.currentUser.role === 'manager' && department.managerId !== req.currentUser.id){
            return res.status(403).json({
                message: 'you can only add employees to your own department'
            })
        }

        const existingEmployee = await prisma.employee.findUnique({
            where: { userId }
        });

        if(existingEmployee){
            return res.status(403).json({
                message: 'this user already has an employee profile'
            })
        }

        const employee = await prisma.employee.create({
            data: { userId, fullName, position, departmentId }
        });

        res.status(201).json({
            message: 'employee created',
            data: employee
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const updateEmployee = async(req, res) => {
    try{

        const { userId } = req.params.id;

        const {newPosition} = req.body;

        const users = await prisma.employee.findUnique({
            where: {
                userId: userId
            },
            data: {
                position: newPosition
            }
        })

        if(!users){
            return res.status(404).json({
                message: 'employee is not existing'
            })
        }

        res.status(200).json({
            message: 'new position assign'
        })
        
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


const deleteEmployee = async (req, res) => {
    try{

        const userId = req.params.id;

        const users = await prisma.employee.findOne({
            where: {
                userId: userId
            }
        });

        if(!users) return res.status(404).json({
            message: 'employee not existed'
        })

        await prisma.exployee.delete({
            where: {
                userId: userId
            }
        })

        res.status(200).json({
            message: 'Employee remove'
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}
module.exports = { addEmployee , getEmployee, updateEmployee, deleteEmployee}
