import mongoose from "mongoose";

const expertOpinionSchema = mongoose.Schema({
    E: {
        type: String,
        required: true
    },
    D: {
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
            return `Source ${this.E} is an expert in subject domain ${this.D} containing proposition ${this.A}, ${this.E} asserts that ${this.A} is true, therefore ${this.A} is true`;
        }
    },
    criticalQuestions: {
        question1: {
            type: String,
            get: function () {
                return `How credible is "${this.E}" as an expert?`;
            }
        },
        question2: {
            type: String,
            get: function () {
                return `Is "${this.E}" an expert in the field that "${this.A}" is in?`;
            }
        },
        question3: {
            type: String,
            get: function () {
                return `Is "${this.E}" personally reliable and trustworthy?`;
            }
        },
        question4: {
            type: String,
            get: function () {
                return `Is "${this.A}" consistent with what other experts assert?`;
            }
        }
    }
});

const ExpertOpinionSchema = mongoose.model('ExpertOpinionSchema', expertOpinionSchema);

export default ExpertOpinionSchema;