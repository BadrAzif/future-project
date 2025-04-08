import { V4} from "paseto";
import {audience, issuer, secretKey, expiresIn, refreshExpiresIn} from "../config/paseto.js";
import { prisma } from "../config/database.js";

const generateTokens = async (user, rememberMe = false) => {
    const payload = {
        sub: user.id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
    };

    const tokenExp = rememberMe ? refreshExpiresIn : expiresIn;

    const expirationDate = new Date();

    const timeValue = parseInt(tokenExp.slice(0, -1));
    const timeUnit = tokenExp.slice(-1);

    if (timeUnit === "h") {
        expirationDate.setHours(expirationDate.getHours() + timeValue);
    } else if (timeUnit === "d") {
        expirationDate.setDate(expirationDate.getDate() + timeValue);
    }
    const privateKey = await V4.generateKey('public');
    const token = await V4.sign(payload, privateKey, {
        issuer,
        audience,
        expiresIn: tokenExp,
    });

    await prisma.session.create({
        data: {
            token,
            userId: user.id,
            expiresAt: expirationDate,
        },
    });
    return {
        token,
        expiresAt: expirationDate,
    };
};
const verifyToken = async (token) => {
    try {
        const payload = await V4.verify(token, secretKey, {
            issuer,
            audience,
        });
        return payload;
    } catch (error) {
        return null;
    }
};
const revokeToken = async (token) => {
    await prisma.session.deleteMany({
        where: {
            token,
        },
    });
};
const revokeAllUserTokens = async (userId) => {
    await prisma.session.deleteMany({
        where: {
            userId,
        },
    });
};
export { revokeToken, revokeAllUserTokens, generateTokens ,verifyToken};
