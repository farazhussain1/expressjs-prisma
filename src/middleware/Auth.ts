import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { ParsedUrlQuery } from "querystring";

declare module "express-serve-static-core" {
  interface Request {
    userId: number;
  }
}

export function AuthMap(req: Request, res: Response, next: NextFunction) {
  req.userId = Number(req.headers.userid);
  console.log(req.userId);
  if (!req.userId) {
    return res.status(403).json({ message: "Unauthenticated" });
  }
  next();
}

export function verifyToken(
  query: ParsedUrlQuery
): string | JwtPayload | boolean {
  try {
    return verify(query.token?.toString() ?? "", "secret");
  } catch (error) {
    return false;
  }
}
