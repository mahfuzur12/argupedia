import axios from 'axios';

const baseURL = 'https://argupedia.onrender.com/argumentSchemas';

export const fetchArgumentSchemas = () => axios.get(baseURL);
export const createActionSchema = (newActionSchema) => axios.post(`${baseURL}/action`, newActionSchema);
export const createExpertOpinionSchema = (newExpertOpinionSchema) => axios.post(`${baseURL}/expert-opinion`, newExpertOpinionSchema);
export const createPositionToKnowSchema = (newPositionToKnowSchema) => axios.post(`${baseURL}/position-to-know`, newPositionToKnowSchema);
export const updateIsAttackedBy = (id, attackerId) => axios.post(`${baseURL}/updateIsAttackedBy`, { id, attackerId });
