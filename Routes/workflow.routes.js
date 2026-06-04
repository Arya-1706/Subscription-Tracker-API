import { Router } from 'express';
import { sendReminders } from '../controllers/workflow.controller.js';
import { workflowClient } from '../config/upstash.js';

const workflowRouter = Router();

workflowRouter.post('/subscription/reminder', sendReminders);

export default workflowRouter;