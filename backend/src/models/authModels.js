const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    fullName: {type: String, required: true, trim: true},
    email: {type: String, required: true, lowercase: true, unique: true, trim: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["admin", "manager", "employee"], default: "employee"},

    resetPassword: {type: String, default: null},
    resetExpiry: {type: String, default: null},

    tokenStore: [{type: String}]
}, {
    timestamps: true
});

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;