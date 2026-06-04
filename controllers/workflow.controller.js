import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';
import {sendreminderEmail} from '../utils/send-email.js';


import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express');

const REMINDERS = [ 7, 5, 2, 1];

export const sendReminders = serve( async (context) => { 
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(
        context,
        subscriptionId
    );

    console.log("TYPE:", typeof subscription);
    console.log("SUB:", subscription);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal Date has passed for subscription ${subscription._id}. Stopping workflow.`);
        return;
    }

    for(const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.clone().subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }
        if(dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, ` ${daysBefore} days before reminder`, subscription);
        }
    }
  });

const fetchSubscription = async (context, subscriptionId) => {

    return await context.run('get subscription',  async () => {
        const subscription = await Subscription
             .findById(subscriptionId)
             .populate('user', 'name email')
             .lean();
         return subscription;
     });    

    }

    
const sleepUntilReminder = async (context, label, date) => {
    console.log(`sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder.`);
        //send Emails, SMS, or push notifications here
        await sendreminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        });
    })
}    