import Joi, { ObjectSchema } from 'joi';

const signinSchema: ObjectSchema = Joi.object().keys({
    username: Joi.string().required().min(4).max(10).messages({
        "string.base": "Username must be of string type",
        "string.min": "Username must be aleast of length 4",
        "string.max": "Username must be of max length 10",
        "string.empty": "Username is a required field"
    }),
    password: Joi.string().required().min(4).max(10).messages({
        "string.base": "Password must be of string type",
        "string.min": "Password must be aleast of length 4",
        "string.max": "Password must be of max length 10",
        "string.empty": "Password is a required field"
    }),
});

export { signinSchema }