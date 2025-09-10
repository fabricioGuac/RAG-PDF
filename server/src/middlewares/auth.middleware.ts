import { Request, Response, NextFunction } from "express";
import { auth } from '../config/firebase.config';

// Extend Express's Request type so we can safely attach a user object
export interface AuthRequest extends Request {
    user?: { uid: string };
}

// Middleware to verify Firebase ID tokens and protect routes
export const verifyAuth = async (req: AuthRequest, res:  Response, next: NextFunction) => {
    // Retrive the authorization from the request header
    const authHeader = req.headers.authorization;
    // If there is no authorization or if it does not hava avalid format return the unauthorized message
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error: "Unauthorized"});
    }

    // Extract the token after "Bearer "
    const token = authHeader.split(" ")[1];

    try {
        // Verify token with Firebase Admin and attach UID to request
        const decodedToken = await auth.verifyIdToken(token);
        req.user = { uid:decodedToken.uid };
        next(); // Continueto the next handler
    } catch (error) {
        console.error(error);
        // Handle invalid, expired, or unverifiable tokens
        return res.status(401).json({ error: "Invalid or expired token :(" });
    }
};

