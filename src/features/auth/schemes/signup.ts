import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
    username: Joi.string().required().min(4).max(10).messages({
        "string.base": "Username must be of string type",
        "string.min": "Username must be aleast of length 4",
        "string.max": "Username must be of max length 10",
        "string.empty": "Username is a required field"
    }),
    email: Joi.string().required().email().messages({
        "string.base": "Email must be of string type",
        "string.email": "Email is a required field",
        "string.empty": "Email is a required field"
    }),
    password: Joi.string().required().min(4).max(10).messages({
        "string.base": "Password must be of string type",
        "string.min": "Password must be aleast of length 4",
        "string.max": "Password must be of max length 10",
        "string.empty": "Password is a required field"
    }),
    avatarImage: Joi.string().required().messages({
        "any.required": "Avatar Image is required"
    }),
    avatarColor: Joi.string().required().messages({
        "any.required": "Avatar color is required"
    })
});

export {signupSchema}