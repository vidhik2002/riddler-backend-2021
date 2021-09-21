const mongoose = require("mongoose");

const MilestoneSchema = new mongoose.Schema({
    milestone:{
        type:Number,
        required:true,
        default:10,
    },
})

const Milestone = mongoose.model("milestone", MilestoneSchema);
module.exports = Milestone;