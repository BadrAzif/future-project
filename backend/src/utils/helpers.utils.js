import crypto from 'crypto';

const generateToken =()=>{
    return crypto.randomBytes(32).toString('hex')
}
const generateVerificationToken = (token)=>{
    return `${process.env.FRONTEND_URL}/verify-email?token=${token}`
}

const generateResetPasswordToken = (token)=>{
    return `${process.env.FRONTEND_URL}/verify-email?token=${token}`
}
export {
    generateResetPasswordToken,
    generateToken,
    generateVerificationToken
}