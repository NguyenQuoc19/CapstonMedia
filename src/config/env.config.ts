import * as Joi from "joi";

const envValidationSchema = Joi.object({
    PORT: Joi.string().required(),
    NODE_ENV: Joi.string().valid("development", "production", "test").required(),
    DATABASE_URL: Joi.string().uri().required(),
});

export default envValidationSchema;