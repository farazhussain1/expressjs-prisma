import { NextFunction, Request, Response } from "express";



declare module "express-serve-static-core" {
    interface Request {
        userId: number;
    }
}


export function AuthMap(req: Request, res: Response, next: NextFunction) {
    req.userId = Number(req.headers.userid);
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthenticated" })
    }
    next();
}