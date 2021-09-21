const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: {
        text: {
            type: String,
            required: true,
        },
        img: [{
            type: String,
        }],
        links: [{
            type: String,
        }],
    },
    answer: [{
        type: String,
        required: true,
    }],
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
    pointType: {
        type: Number,
        required: true,
    },
    hint: {
        text: {
            type: String,
            required: true,
        },
        img: [{
            type: String,
        }],
        links: [{
            type: String,
        }],
    },
    track: [{
        type: Number,
        required: true,
    }],
});

const Question = mongoose.model("question", QuestionSchema);
module.exports = Question;
