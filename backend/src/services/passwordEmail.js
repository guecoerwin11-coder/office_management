const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const passwordResetEmail = async (toEmail, name, link) => {
    try{

        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'forgot Password',
            html: `<h1>Hi ${name}!</h1>
                <p>You requested a password reset.</p>
                <a href="${link}" style="
                    background: #f44336;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    display: inline-block;
                    margin: 20px 0;
                ">Reset Password</a>
                <p>This link expires in <strong>15 minutes</strong>.</p>
                <p>If you didn't request this, ignore this email.</p>
    `
        })
    }catch(err){
        res.status(500).json({
            message: 'email service error'
        })
    }
}

module.exports = {passwordResetEmail}
