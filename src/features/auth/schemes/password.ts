import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
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
    
});

const passwordSchema: ObjectSchema = Joi.object().keys({
    password: Joi.string().required().min(4).max(10).messages({
        "string.base": "Password must be of string type",
        "string.min": "Password must be aleast of length 4",
        "string.max": "Password must be of max length 10",
        "string.empty": "Password is a required field"
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        "any.only":"Password should match",
        "any.required":"Confirm password is a required field"
    })
});

export { passwordSchema,emailSchema }