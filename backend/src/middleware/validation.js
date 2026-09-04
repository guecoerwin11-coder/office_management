const validation = (schema) => (req, res, next) => {
    try{

        const results = schema.safeParse(req.body);

        if(!results.success){
            return res.status(400).json({
                errors: results.error.flatten().fieldErrors
            })
        }

        req.body = results.data;
        next()
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = validation;