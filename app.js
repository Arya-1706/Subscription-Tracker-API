import express from 'express';
import cookieParser from 'cookie-parser';

import {PORT} from './node_modules/env.js';


import userRouter from './Routes/user.routes.js';
import authRouter from './Routes/auth.routes.js';
import subscriptionRouter from './Routes/subscription.routes.js';
import connectToDataBase from './Database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjet from './config/arcjet.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './Routes/workflow.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(arcjetMiddleware);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req,res) => {
    res.send( 'Welcome to the Subscription Tracking API!');
});

app.listen(PORT, async () => {
    console.log(`Subscription Tracking API is running on http://localhost:${PORT}`);

    await connectToDataBase();
});

export default app;