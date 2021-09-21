const mongoose = require("mongoose");

const HintPenaltySchema = new mongoose.Schema({
    hintPenalty:{
        type:Number,
        required:true,
        default:40,
    },
})

const HintPen = mongoose.model("hintPenalty", HintPenaltySchema);
module.exports = HintPen;