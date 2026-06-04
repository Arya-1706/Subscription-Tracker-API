import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../node_modules/env.js';

if( !DB_URI) {
    throw new Error('Please define MONGODB_URI in environment variable inside .env.<development/prodeuction>.local');
}
 const connectToDataBase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to DB  in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectToDataBase;