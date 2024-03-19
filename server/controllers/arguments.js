import ActionSchema from "../models/actionSchema.js";
import ExpertOpinionSchema from "../models/expertOpinionSchema.js";
import PositionToKnowSchema from "../models/positionToKnowSchema.js";

export const getArguments = async (req, res) => {
    try {
        const action_schemas = await ActionSchema.find();
        const expert_opinion_schemas = await ExpertOpinionSchema.find();
        const position_to_klnow_schemas = await PositionToKnowSchema.find();

        const argument_schemas = [...action_schemas, ...expert_opinion_schemas, ...position_to_klnow_schemas];

        res.status(200).json(argument_schemas);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createActionSchema = async (req, res) => {
    try {
        const { R, A, S, G, V, isReply = false, chosenCriticalQuestion } = req.body;
        const new_action_schema = new ActionSchema({ R, A, S, G, V, isAttackedBy: [], isReply, chosenCriticalQuestion });
        const saved_action_schema = await new_action_schema.save();
        res.status(201).json(saved_action_schema);
    } catch (error) {
        console.error(error);
        res.status(409).json({ message: error.message });
    }
};

export const createExpertOpinionSchema = async (req, res) => {
    try {
        const { E, D, A, isReply = false, chosenCriticalQuestion } = req.body;
        const new_expert_opinion_schema = new ExpertOpinionSchema({ E, D, A, isAttackedBy: [], isReply, chosenCriticalQuestion });
        const saved_expert_opinion_schema = await new_expert_opinion_schema.save();
        res.status(201).json(saved_expert_opinion_schema);
    } catch (error) {
        console.error(error);
        res.status(409).json({ message: error.message });
    }
};

export const createPositionToKnowSchema = async (req, res) => {
    try {
        const { P, A, isReply = false, chosenCriticalQuestion } = req.body;
        const new_position_to_know_schema = new PositionToKnowSchema({ P, A, isAttackedBy: [], isReply, chosenCriticalQuestion });
        const saved_position_to_know_schema = await new_position_to_know_schema.save();
        res.status(201).json(saved_position_to_know_schema);
    } catch (error) {
        console.error(error);
        res.status(409).json({ message: error.message });
    }
};

// Updates the 'isAttackedBy' field of a given argument schema
export const updateIsAttackedBy = async (req, res) => {
    const { id, attackerId } = req.body;

    try {
        let updated_schema;

        updated_schema = await ActionSchema.findOneAndUpdate(
            { _id: id },
            { $push: { isAttackedBy: attackerId } },
            { new: true }
        );

        if (updated_schema) {
            return res.status(200).json(updated_schema);
        }

        updated_schema = await ExpertOpinionSchema.findOneAndUpdate(
            { _id: id },
            { $push: { isAttackedBy: attackerId } },
            { new: true }
        );

        if (updated_schema) {
            return res.status(200).json(updated_schema);
        }

        updated_schema = await PositionToKnowSchema.findOneAndUpdate(
            { _id: id },
            { $push: { isAttackedBy: attackerId } },
            { new: true }
        );

        if (updated_schema) {
            return res.status(200).json(updated_schema);
        }

        return res.status(404).json({ message: 'Argument schema not found' });

    } catch (error) {
        console.error('Error updating argument schema:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



