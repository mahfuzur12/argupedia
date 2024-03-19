import * as api from '../api';

export const FETCH_ALL = 'FETCH_ALL';
export const CREATE_ACTION_SCHEMA = 'CREATE_ACTION_SCHEMA';
export const CREATE_EXPERT_OPINION_SCHEMA = 'CREATE_EXPERT_OPINION_SCHEMA';
export const CREATE_POSITION_TO_KNOW_SCHEMA = 'CREATE_POSITION_TO_KNOW_SCHEMA';
export const UPDATE_IS_ATTACKED_BY = 'UPDATE_IS_ATTACKED_BY';

export const updateIsAttackedBy = (id, attackerId) => async (dispatch) => {
    try {
        await api.updateIsAttackedBy(id, attackerId);
        dispatch({ type: 'UPDATE_IS_ATTACKED_BY', payload: { id, attackerId }});
    } catch (error) {
        console.log(error.message);
    }
}

export const getArgumentSchemas = () => async (dispatch) => {
    try {
        const { data } = await api.fetchArgumentSchemas();
        dispatch({ type: FETCH_ALL, payload: data });
    } catch (error) {
        console.log(error.message);
    }
}

export const createActionSchema = (actionSchema) => async (dispatch) => {
    try {
        const { data } = await api.createActionSchema(actionSchema);
        dispatch({ type: CREATE_ACTION_SCHEMA, payload: data });
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

export const createExpertOpinionSchema = (expertOpinionSchema) => async (dispatch) => {
    try {
        const { data } = await api.createExpertOpinionSchema(expertOpinionSchema);
        dispatch({ type: CREATE_EXPERT_OPINION_SCHEMA, payload: data });
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

export const createPositionToKnowSchema = (positionToKnowSchema) => async (dispatch) => {
    try {
        const { data } = await api.createPositionToKnowSchema(positionToKnowSchema);
        dispatch({ type: CREATE_POSITION_TO_KNOW_SCHEMA, payload: data });
        return data;
    } catch (error) {
        console.log(error.message);
    }
}
