import Joi from '@hapi/joi';

export const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
});