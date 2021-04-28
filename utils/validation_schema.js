const Joi = require("joi");

const authPenaltySchema = Joi.object().keys({
    uname: Joi.string().alphanum().min(3).max(30).required(),
    newquesId: Joi.number().integer().required(),
    condition: Joi.boolean(),
});
const authUserSchema = Joi.object().keys({
    uname: Joi.string().alphanum().min(3).max(30).required(),
    quesId: Joi.number().integer().required(),
    limit:  Joi.number().integer().min(1).max(2),
    ans: Joi.array().items(Joi.string(Joi.ref('limit')).required()),
    });


module.exports = (
    authUserSchema,
    authPenaltySchema
)