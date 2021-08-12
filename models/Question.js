const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: [String],
        required: true,
    },
    questionId: {
        type: Number,
        required: true,
        unique:true,
    },
    isPortal: {
        type: Boolean,
        required: true,
    },
    isStarting: {
        type: Boolean,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    hint: {
        type: String,
        required: true,
    },
    isHint: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const Question = mongoose.model("question", QuestionSchema);
module.exports = Question;
