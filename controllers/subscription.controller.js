import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from 'env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });
        

        await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id
            },
            headers: { 
                'content-type': 'application/json'
            },
            retries: 0,
        }); 

        res.status(201).json({
            success: true,
            data: subscription
        });

        console.log("Subscription created:", subscription);
        } catch(e)  {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        //check if the user is same as the one in the token
        if(req.user.id !== req.params.id) {
            const error = new Error('you are not the owner of this subscription');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch(e) {
        next(e);
    }               
}

