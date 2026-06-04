import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../node_modules/env.js';

export const signUp = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const { name, email, password } = req.body;

        //Check if user already exists
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            const error = new Error('User already exists');
            error.status = 400;
            throw error;
        }

        //hash password
        const Salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, Salt);
        //Create new user
        const newUsers = await User.create({
            name,
            email,
            password: hashedPassword
        });

        await newUsers.save({session});

        const token = jwt.sign({ UserId: newUsers._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
              token,  
              user: newUsers
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        //Check if user exists
        const user = await User.findOne({ email });

        if(!user) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        //Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        //Generate token
        const token = jwt.sign({ UserId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user: user
            }
        });

    } catch (error) {
        next(error);
    }
};

export const signOut = async(req, res, next) => {};