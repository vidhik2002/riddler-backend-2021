const Joi = require('joi');

const authPenaltySchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    quesId: Joi.number().integer().required(),
});
const authUserSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    quesId: Joi.number().integer().required(),
    answer: Joi.array().items(Joi.string()).min(1).max(2)
       .required(),
});
const quesSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    quesId: Joi.number().integer().required(),
})

module.exports = {
    authUserSchema,
    authPenaltySchema,
    quesSchema,
};