const Joi = require('joi');

const authPenaltySchema = Joi.object().keys({
    uname: Joi.string().alphanum().min(3).max(30).required(),
    newquesId: Joi.number().integer().required(),
    condition: Joi.boolean().required(),
});
const authUserSchema = Joi.object().keys({
    uname: Joi.string().alphanum().min(3).max(30).required(),
    quesId: Joi.number().integer().required(),
    // ans: Joi.array().items(Joi.string()).min(1).max(2)
    //     .required(),
});

module.exports = {
    authUserSchema,
    authPenaltySchema,
};
