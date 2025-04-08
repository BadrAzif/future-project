import {
    register,
    login,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    logout,
} from "../services/auth.service.js";
import logger from "../utils/loggers.utils.js";

const registerCtrl = async (req, res) => {
    try {
        const userData  = req.body;
        const user = await register(userData);
        return res.status(201).json({
            status: "success",
            message: "user registered successfully, please verify your email",
            data: { user },
        });
    } catch (error) {
        logger.error("error in register controller", error);
        if (error.message === "User with this email already exists") {
            return res.status(409).json({
                status: "error",
                message: error.message,
            });
        }

        return res.status(500).json({
            status: "error",
            message: "server internal error",
        });
    }
};
const loginCtrl = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const { user, token, expiresAt } = await login(email, password, rememberMe);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            expires: expiresAt,
        });
        return res.status(200).json({
            status: "success",
            message: "user logged in successfully",
            data: { user, token, expiresAt },
        });
    } catch (error) {
        logger.error("Login controller error", error);

        let statusCode = 500;
        let message = "Login failed. Please try again.";

        if (error.message === "Invalid credentials") {
            statusCode = 401;
            message = "Invalid email or password";
        } else if (error.message === "Please verify your email before logging in") {
            statusCode = 403;
            message = error.message;
        }

        res.status(statusCode).json({
            status: "error",
            message,
        });
    }
};

const verifyEmailCtrl = async (req, res) => {
    try {
        const { token } = req.params;
        await verifyEmail(token);
        return res.status(200).json({
            status: "success",
            message: "Email verified successfully",
        });
    } catch (error) {
        logger.error("Email verification controller error", error);

        let statusCode = 500;
        let message = "Email verification failed. Please try again.";

        if (error.message === "Invalid or expired verification token") {
            statusCode = 400;
            message = error.message;
        }

        res.status(statusCode).json({
            status: "error",
            message,
        });
    }
};

const requestPasswordResetCtrl = async (req, res) => {
    try {
        const { email } = req.body;
        await requestPasswordReset(email);
        return res.status(200).json({
            status: "success",
            message: "Password reset request sent successfully",
        });
    } catch (error) {
        logger.error("Password reset request controller error", error);
        res.status(500).json({
            status: "error",
            message: "Failed to process password reset request. Please try again.",
        });
    }
};
const resetPasswordCtrl = async (req, res) => {
    try {
        const { token, password } = req.body;
        await resetPassword(token, password);
        return res.status(200).json({
            status: "success",
            message: "Password reset successfully",
        });
    } catch (error) {
        logger.error("Password reset controller error", error);

        let statusCode = 500;
        let message = "Password reset failed. Please try again.";

        if (error.message === "Invalid or expired reset token") {
            statusCode = 400;
            message = error.message;
        }

        res.status(statusCode).json({
            status: "error",
            message,
        });
    }
};

const logoutCtrl = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split("")[1];

        if (token) {
            await logout(token);
        }
        res.clearCookie("token");
        return res.status(200).json({
            status: "success",
            message: "Logout successfully",
        });
    } catch (error) {
        logger.error("Logout controller error", error);
        res.status(500).json({
            status: "error",
            message: "Logout failed. Please try again.",
        });
    }
};
const getProfileCtrl = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            status: "success",
            data: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        logger.error("Get profile controller error", error);
        res.status(500).json({
            status: "error",
            message: "Failed to get profile. Please try again.",
        });
    }
};
export {
    registerCtrl,
    loginCtrl,
    verifyEmailCtrl,
    requestPasswordResetCtrl,
    resetPasswordCtrl,
    logoutCtrl,
    getProfileCtrl,
};
