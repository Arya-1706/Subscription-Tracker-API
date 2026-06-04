import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'env.js';
import User from '../models/user.model.js';

const authorize = async(req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) return res.status(401).json({
            message: 'Unauthorized'
        });

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const user = await User.findById(decoded.UserId);
        console.log("Found User:", user);

        if(!user) return res.status(401).json({
            message: 'Unauthorized'
        });

        req.user = user;

        next();

    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized',
            error: error.message
        });
    }   
};

export default authorize;