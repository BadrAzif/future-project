import logger from '../utils/loggers.utils.js'
import { generateToken } from '../utils/helpers.utils.js'
import { hashpassword, verifyPassword } from '../utils/password.utils.js'
import { generateTokens, revokeToken, verifyToken, revokeAllUserTokens } from '../services/token.service.js'
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/email.service.js'
import { prisma } from '../config/database.js'
import argon2 from 'argon2'
const register = async (userData) => {
    try {
        const existUser = await prisma.user.findUnique({
            where: {
                email: userData.email
            }
        })
        if (existUser) {
            throw new Error("user already exists");
        }

        const hashedPassword = await hashpassword(userData.password)

        const verificationToken = generateToken()
        const user = await prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                verificationToken
            }
        })
        await sendVerificationEmail(user.email, verificationToken)
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isVerified: user.isVerified
        }
    } catch (error) {
        logger.error('Registration error', error.stack);
        throw error;
    }
}
const login = async (email, password, rememberMe = false) => {
    try {
        const existUser = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (!existUser || !existUser.password) {
            throw new Error('invalid credentials')
        }

        const isValidPassword = await verifyPassword(existUser.password, password)
        if (!isValidPassword) {
            throw new Error('invalid credentails')
        }
        if (!existUser.isVerified) {
            throw new Error('Please verify your email before logging in');
        }
        const { token, expiresAt } = await generateTokens(existUser, rememberMe)
        if (rememberMe) {
            const rememberMeToken = generateToken()
            await prisma.user.update({
                where: {
                    id: existUser.id,
                }, data: {
                    rememberMeToken
                }
            })
        }
        return {
            user: {
                id: existUser.id,
                email: existUser.email,
                firstName: existUser.firstName,
                lastName: existUser.lastName
            },
            token,
            expiresAt
        };
    } catch (error) {
        logger.error('login error', error.stack);
        throw error;
    }
}
const verifyEmail = async (token) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token
            }
        })
        if (!user) {
            throw new Error('invalid or expired verification token')
        }

        await prisma.user.update({
            where: {
                id: user.id
            }, data: {
                isVerified: true,
                verificationToken: null
            }
        })
        return true
    } catch (error) {
        logger.error('error in verify Email', error)
        throw error
    }
}
const requestPasswordReset = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            throw new Error('user not found')
        }
        const resetToken = generateToken()
        const resetTokenExpiry = new Date()
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1)
        await prisma.user.update({
            where: {
                id: user.id
            }, data: {
                resetToken,
                resetTokenExpiry
            }
        })
        await sendPasswordResetEmail(email, resetToken)
        return true
    } catch (error) {
        logger.error('error in request password reset', error)
        throw error
    }
}
const resetPassword = async (token, newPassword) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        })
        if (!user) {
            throw new Error('invalid or expired reset token')
        }

        const hashedPassword = await hashpassword(newPassword)
        await prisma.user.update({
            where: {
                id: user.id
            }, data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        })
        await revokeAllUserTokens(user.id)
        return true
    } catch (error) {
        logger.error('error in reset password', error)
        throw error
    }
}
const logout = async (token) => {
    try {
        await revokeToken(token)
        return true
    } catch (error) {
        logger.error('error in logout', error.stack)
        throw error
    }
}

export { register, login, verifyEmail, requestPasswordReset, resetPassword, logout }