import { V4 } from "paseto";
import logger from "../utils/loggers.utils.js";
import { prisma } from "../config/database.js";
import { audience, issuer, secretKey } from "../config/paseto.js";

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ status: "error", message: "authentication required" });
        }
        try {
            await V4.verify(token,secretKey, {
                issuer,
                audience,
            });

            const session = await prisma.session.findUnique({
                where: {
                    token,
                },
                include: {
                    user: true,
                },
            });
            if (!session || new Date() > session.expiresAt) {
                return res
                    .status(401)
                    .json({
                        status: "error",
                        message: "session expired, please login again",
                    });
            }

            req.user = session.user;
            req.token = token;
            next();
        } catch (error) {
            logger.error("Token verification failed", error.stack);
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token",
            });
        }
    } catch (error) {
        logger.error("Error authenticating user", error);
        return res
            .status(500)
            .json({ status: "error", message: "Error authenticating user" });
    }
};
export { authenticate };