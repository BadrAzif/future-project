import Joi from "joi";

const schemas = {
    register: Joi.object({
        email: Joi.string().email().trim().required(),
        password: Joi.string().min(8).max(32).required(),
        firstName: Joi.string().trim().min(3).max(20).required(),
        lastName: Joi.string().trim().min(3).max(20).required(),
    }),

    login: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        rememberMe: Joi.boolean().default(false),
    }),

    resetRequest: Joi.object({
        email: Joi.string().email().trim().required(),
    }),

    resetPassword: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(8).max(32).required(),
    }),

    verify: Joi.object({
        token: Joi.string().required(),
    }),
};
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(422).json({
                status:'error',
                message: error.details[0].message,
            });
        }
        next();
    };
};

export {
    schemas,
    validate
}