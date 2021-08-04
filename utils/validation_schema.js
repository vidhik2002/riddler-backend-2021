const Joi = require('joi');

const authPenaltySchema = Joi.object().keys({
    uname: Joi.string().alphanum().min(3).max(30),
    newquesId: Joi.number().integer().required(),
    condition: Joi.boolean(),
});
const authUserSchema = Joi.object().keys({
    uname: Joi.string().alphanum().min(3).max(30),
    quesId: Joi.number().integer().required(),
    ans: Joi.array().items(Joi.string()).min(1).max(2)
        .required(),
});

module.exports = {
    authUserSchema,
    authPenaltySchema,
};
