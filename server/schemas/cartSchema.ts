import joi from "@hapi/joi";

export const cartSchema = joi.object({
  date: joi.date().required(),
  userId: joi.string().required(),
});