const Auth = require('../models/authModels')

const authorize = async (req, res, next) => {
    try{
        const user = await Auth.findOne(req.user.id);

    if(!user || !user.role !== 'admin'){
        return res.status(403).json({
            message: 'only authorize member can access this'
        })
    }
    next()
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = authorize