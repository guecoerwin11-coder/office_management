const mongoose = require("mongoose")

const connectDB = async () =>{
    try{
         await mongoose.connect(process.env.MONGODB_URI, {
        tls: true,
        tlsAllowInvalidCertificates: true,
        serverSelectionTimeoutMS: 10000
    })
        console.log('mongo database active')
    }catch(err){
        console.log('mongo database error', err.message)
    }
}

module.exports = connectDB