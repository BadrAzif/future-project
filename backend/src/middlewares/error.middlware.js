import logger from "../utils/loggers.utils.js";

const errorHandler = (err, req, res, next) => {
    logger.error("occurred error", err);

    if (err.code && err.code.startsWith("P")) {
        if (err.code == "P2002") {
            return res
                .status(409)
                .json({ status: "error", message: "resource already exists" });
        }
        return res
            .status(400)
            .json({ status: "error", message: "database error occurred" });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "something went wrong";
    return res.status(statusCode).json({ status: "error", message });
};

export { errorHandler } ;
