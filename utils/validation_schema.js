const Joi = require("joi");

const authPenaltySchema = Joi.object().keys({
  quesId: Joi.number().integer().max(40).min(1).required(),
});
const authUserSchema = Joi.object().keys({
  quesId: Joi.number().integer().max(40).min(1).required(),
  answer: Joi.string().min(1).max(200).required(),
});
const quesSchema = Joi.object().keys({
  quesId: Joi.number().integer().max(40).min(1).required(),
});

module.exports = {
  authUserSchema,
  authPenaltySchema,
  quesSchema,
};
