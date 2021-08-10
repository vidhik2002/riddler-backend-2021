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
    },
    isPortal: {
        type: Boolean,
        required: true,
    },
    isBridge: {
        type: Boolean,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    });

const Question = mongoose.model("question", QuestionSchema);
module.exports = Question;
