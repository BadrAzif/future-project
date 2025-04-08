import {generateVerificationToken,generateResetPasswordToken} from '../utils/helpers.utils.js'
import logger from '../utils/loggers.utils.js'
import {transporter,from} from '../config/email.js'

const sendVerificationEmail =async (email,token)=>{
    const verificationUrl = generateVerificationToken(token)

    const mailOptions={
        from,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `
    }
    try {
        await transporter.sendMail(mailOptions)
        logger.info(`Verification email sent to ${email}`);
        return true
    } catch (error) {
        logger.info(`failed to send Verification email to ${email}`,error);
        return false
    }
}

const sendPasswordResetEmail =async (email,token)=>{
    const resetUrl = generateResetPasswordToken(token)

    const mailOptions={
        from,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${resetUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `
    }
    try {
        await transporter.sendMail(mailOptions)
        logger.info(`Reset password email sent to ${email}`);
        return true
    } catch (error) {
        logger.info(`failed to send password reset to ${email}`,error);
        return false
    }
}
export{
     sendPasswordResetEmail,
     sendVerificationEmail
}
