const Auth = require('../models/authModels')
const crypto = require('crypto')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const token = (user) => {
    return jwt.sign(
        {
        id: user.id, fullName: user.fullName, email: user.email, role: user.role
        }, 
        process.env.JWT_SECRET,
        {expiresIn: '2d'}
    )
}

const register = async (req, res) => {
    try{

        const {fullName, email, password, role} = req.body;

        const isActive = await Auth.findOne({email});

        if(isActive){
            return res.status(403).json({
                message: 'email is already used'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const user = await Auth.create({
            fullName, email, password: hashPass, role
        })

        const jwtToken = token(user);

        res.status(201).json({
            message: 'successfull register',
            token: jwtToken,
            data: {
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const login = async (req, res) => {
    try{

        const {email, password} = req.body;

        const user = await Auth.findOne({email});

        if(!user){
            return res.status(401).json({
                message: 'email is not register'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).json({
                message: 'Invalid credentials, wrong password'
            })
        }

        const jwtToken = token(user);

        res.status(200).json({
            message: 'login success',
            token: jwtToken
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const forgotPassword = async (req, res) => {
    try{

        const {email} = req.body;

        const user = await Auth.findOne({ email });

        if(!user) {
            return res.status(400).json({
                message: 'email is not register here'
            })
        }

        const newToken = crypto.randomBytes(32).toString('hex')

        user.resetPassword = crypto.createHash('sha256').update(newToken).digest('hex');

        user.resetExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await user.save()

        const newLink = `${process.env,CLIENT_URL}/reset-password/${newToken}`


        res.status(200).json({
            message: 'check your email sent'
        })
        
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


const resetPassword = async (req, res) => {
    try{
        const {token, newPassword} = req.body;

        if(!token || !newPassword) return res.status(400).json({
            message: 'token and password is required'
        })

        if(newPassword < 6){
            return res.status(400).json({
                message: 'password too short'
            })
        }

        const hashToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await Auth.findOne({
            resetPassword: hashToken,
            resetExpiry: { $gt: Date.now() }
        })

        if(!user) return res.status(401).json({
            message: 'token is expired'
        })

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(newPassword, salt);

        user.resetPassword = null;
        user.resetExpiru = null;

        user.tokenStore = []
        await user.save()

        res.status(200).json({
            message: 'success change new password'
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    register, login, forgotPassword, resetPassword
}