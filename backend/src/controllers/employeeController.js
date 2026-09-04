const prisma = require("../configs/postgres")
const Auth = require("../models/authModels");

const addEmployee = async (req, res) => {
    try{

        const userId = req.body;

        const user = await Auth.findById({ userId })

        if(!user){
            return res.status(404).json({
                message: 'User is not existed'
            })
        }

        const {fullName, positions, departmentId} = req.body;
        
    }catch(errr){
        res.status(500).json({
            message: err.message
        })
    }
}