import { prisma } from "../config/database.js";
import {
    generateTokens,
} from "../services/token.service.js";
import logger from "../utils/loggers.utils.js";

const handleSocialLogin = async (req, res, provider) => {
    try {
        const { providerId, profile, accessToken, refreshToken } = req.body;
        if (!providerId || !profile) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields",
            });
        }
        let socialAccount = await prisma.socialAccount.findFirst({
            where: {
                provider,
                providerId,
            },
            include: {
                user: true,
            },
        });
        let user;
        if (socialAccount) {
            socialAccount = await prisma.socialAccount.update({
                where: {
                    id: socialAccount.id,
                },
                data: {
                    accessToken,
                    refreshToken,
                },
                include: {
                    user: true,
                },
            });
            user = socialAccount.user;
        } else {
            user = await prisma.user.findFirst({
                where: {
                    email: profile.email,
                },
            });
            if (user) {
                socialAccount = await prisma.socialAccount.create({
                    data: {
                        provider,
                        providerId,
                        accessToken,
                        refreshToken,
                        userId: user.id,
                    },
                });
            } else {
                socialAccount = await prisma.socialAccount.create({
                    data: {
                        email: profile.email,
                        firstName: profile.firstName || profile.given.firstName || "",
                        lastName: profile.lastName || profile.family.lastName || "",
                        isVerified: true,
                        socialAccounts: {
                            provider,
                            providerId,
                            accessToken,
                            refreshToken,
                        },
                    },
                });
            }
        }

        const { token, expiresAt } = await generateTokens(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            expires: expiresAt,
        });
        return res.status(200).json({
            status: "success",
            message: `user logged in successfully with ${provider}`,
            data: { user, token, expiresAt },
        });
    } catch (error) {
        logger.error(`${provider} login error`, error);
        res.status(500).json({
            status: "error",
            message: `${provider} login failed. Please try again.`,
        });
    }
};
const googlelogin = async (req, res) => await handleSocialLogin(req, res, "google");
const facebooklogin = async (req, res) => await handleSocialLogin(req, res, "facebook");
const githublogin = async (req, res) => await handleSocialLogin(req, res, "github");
const applelogin = async (req, res) => await handleSocialLogin(req, res, "apple");

export { googlelogin, facebooklogin, githublogin, applelogin };
