const Auth = require('../models/authModels')

const isAuthorized = (allowedRoles = []) => async (req, res, next) => {
    try{
        const user = await Auth.findById(req.user.id);

        if(!user || !allowedRoles.includes(user.role)){
            return res.status(403).json({
                message: 'only authorize member can access this'
            })
        }

        // avoid re-querying Mongo for the same user later in the controller
        req.currentUser = user;
        next()
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = isAuthorized
