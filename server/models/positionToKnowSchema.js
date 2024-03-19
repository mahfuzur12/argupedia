import mongoose from "mongoose";

const positionToKnowSchema = mongoose.Schema({
    P: {
        type: String,
        required: true
    },
    A: {
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
            return `${this.P} is in a position to know whether ${this.A} is true or not, ${this.P} asserts that ${this.A} is true, therefore ${this.A} is true`;
        }
    },
    criticalQuestions: {
        question1: {
            type: String,
            get: function () {
                return `Is "${this.P}" really in a position to know whether "${this.A}" is true?`;
            }
        },
        question2: {
            type: String,
            get: function () {
                return `Is "${this.P}" an honest, trustworthy and reliable source?`;
            }
        },
        question3: {
            type: String,
            get: function () {
                return `Did "${this.P}" really assert that "${this.A}" is true?`;
            }
        }
    }
});

const PositionToKnowSchema = mongoose.model('PositionToKnowSchema', positionToKnowSchema);

export default PositionToKnowSchema;