const prisma = require('../configs/postgres');
const Auth = require('../models/authModels');

        //query status should like this leaves?status=PENDING
        const ALLOWED_STATUS = ['PENDING', 'APPROVED', 'REJECTED'];

        //
        const ALLOWED_TYPE = ['SICK', 'CASUAL', 'ANNUAL']

const requestLeave = async (req, res) => {
    try{

            return res.status(400).json({
                message: 'required fill it'
            })
        }


        res.status(500).json({
            message: err.message
        })
    }
}


