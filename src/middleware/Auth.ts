import { NextFunction, Request, Response } from "express";

export function AuthMap(req: Request, res: Response, next: NextFunction) {
    req.userId = Number(req.headers.userid);  
    console.log(req.userId);
    
    next();
}