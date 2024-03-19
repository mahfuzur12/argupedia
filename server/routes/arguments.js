import express from 'express';
import { getArguments, createActionSchema, createExpertOpinionSchema, createPositionToKnowSchema, updateIsAttackedBy } from '../controllers/arguments.js';

const router = express.Router();

router.get('/', getArguments);

router.post('/action', createActionSchema);
router.post('/expert-opinion', createExpertOpinionSchema);
router.post('/position-to-know', createPositionToKnowSchema);

router.post('/updateIsAttackedBy', updateIsAttackedBy);

export default router;
