import argon2 from "argon2";

const hashpassword = async (password) => {
    if (!password) {
        throw new Error("password is a required argument");
    }

    try {
        return await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
        });
    } catch (error) {
        throw new Error(`failed to hash password: ${error.message}`);
    }
};

const verifyPassword = async (hash, password) => {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        throw new Error("failed to verify password");
    }
};

export { hashpassword, verifyPassword };
