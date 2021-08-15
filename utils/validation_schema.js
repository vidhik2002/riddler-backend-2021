const Joi = require('joi');

const authPenaltySchema = Joi.object().keys({
    quesId: Joi.number().integer().required(),
});
const authUserSchema = Joi.object().keys({
    quesId: Joi.number().integer().required(),
    answer: Joi.array().items(Joi.string()).min(1).max(2)
       .required(),
});
const quesSchema = Joi.object().keys({
    quesId: Joi.number().integer().required(),
})

module.exports = {
    authUserSchema,
    authPenaltySchema,
    quesSchema,
};