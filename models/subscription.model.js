import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription Price is required'],
        min: 0,
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'INR'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['entertainment', 'productivity', 'education', 'health', 'other'],
        required: [true, 'Subscription Category is required'],
    },
    paymentMethod: {
        type: String,
        enum: ['credit card', 'debit card', 'paypal', 'bank transfer', 'other'],
        required: [true, 'Payment Method is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'canceled', 'paused'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Subscription Start Date is required'],
        validate: {
            validator: (value) => value <= new Date(), 
            message: 'Start Date must be in the past.',   
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Renewal Date must be after Start Date.',
        }
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Subscription must be associated with a User'],
        index: true,
    }        
}, { timestamps: true });

// Auto-calculate renewalDate if missing 
subscriptionSchema.pre('save', function() {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,    
            yearly: 365,
        };
        
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //Auto-Update status to 'canceled' if renewalDate is in the past
    if (this.renewalDate < new Date()) {
        this.status = 'canceled';
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;

