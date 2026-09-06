const prisma = require('../configs/postgres')
const Auth = require('../models/authModels')


//   admin/users?role=manager  endpoints
const getRoles = async (req, res) => {
    try{

        const { role } = req.query;

        const query = role ? { role: role.toLowerCase()} : {};

        const users = await Auth.find(query);

        res.status(200).json({
            roles: {
                managerId: users.managerId,
                fullName: users.fullName,
                email: users.email,
                role: users.manageer
            }
        })

        
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const addDepartment = async (req, res) => {
    try{

        const {managerId, name } = req.body;

        if(!managerId || !name) {
            return res.status(400).json({
                message: 'Id and name is required'
            })
        }

        const department = await prisma.department.create({
            data:
            {
                managerId: managerId,
                name: name
            }
        })

        res.status(201).json({
            message: 'department created',
            data:{
                manager: department.managerId,
                station: department.name
            }
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const getDepartments = async (req,res) =>{
    try{

        const department = await prisma.department.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            message: 'department list',
            data: department
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const updateManager = async (req, res) => {
    try{

        // the department is looked up by its own id (from the route),
        // not by managerId, since managerId isn't a unique field in the schema
        const departmentId = req.params.id;
        const { managerId } = req.body;

        if(!departmentId || !managerId) return res.status(400).json({
            message: 'department id and manager id is required'
        });

        // findUnique can't take a `data` option, so check existence first,
        // then update separately
        const existing = await prisma.department.findUnique({
            where: { id: departmentId }
        });

        if(!existing) return res.status(404).json({
            message: 'No department existed'
        })

        const department = await prisma.department.update({
            where: { id: departmentId },
            data: { managerId }
        });

        res.status(200).json({
            message: 'new manager assign',
            data: {
                department_station: department.name,
                manager: department.managerId
            }
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const removeDepartment = async (req,res) => {
    try{
        // route param is the department's own id, not the manager's id
        const departmentId = req.params.id;

        if(!departmentId) return res.status(400).json({
            message:'department id is required'
        })

        // prisma.delete() throws (doesn't return null) when the row is
        // missing, so existence has to be checked beforehand
        const existing = await prisma.department.findUnique({
            where: { id: departmentId }
        });

        if(!existing){
            return res.status(404).json({
                message: 'department is not existed'
            })
        }

        await prisma.department.delete({
            where: { id: departmentId }
        })

        res.status(200).json({
            message: 'deleted success'
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    getRoles, addDepartment,
    updateManager, getDepartments, removeDepartment
}