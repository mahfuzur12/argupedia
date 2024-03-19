import mongoose from "mongoose";

const actionSchema = mongoose.Schema({
    R: {
        type: String,
        required: true
    },
    A: {
        type: String,
        required: true
    },
    S: {
        type: String,
        required: true
    },
    G: {
        type: String,
        required: true
    },
    V: {
        type: String,
        required: true
    },
    isAttackedBy: {
        type: [String], 
        default: [] 
    },
    isReply: {
        type: Boolean,
        required: true
    },
    chosenCriticalQuestion: {
        type: Number,
        default: null
    },
    summary: {
        type: String,
        get: function () {
            return `In the current circumstances ${this.R}, we should perform action ${this.A}, which will result in new circumstances ${this.S}, realizing goal ${this.G}, promoting value ${this.V}`;
        }
    },
    criticalQuestions: {
        question1: {
            type: String,
            get: function () {
                return `Are the believed circumstances "${this.R}" true?`;
            }
        },
        question2: {
            type: String,
            get: function () {
                return `Does the goal "${this.G}" realize the value "${this.V}" stated?`;
            }
        },
        question3: {
            type: String,
            get: function () {
                return `Are there alternative ways of promoting the same values "${this.V}"?`;
            }
        },
        question4: {
            type: String,
            get: function () {
                return `Is the action "${this.A}" possible?`;
            }
        }
    }
});

const ActionSchema = mongoose.model('ActionSchema', actionSchema);

export default ActionSchema;
