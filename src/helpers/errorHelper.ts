import { Response } from "express";

export function error(type: "validationError" | "catchError", error: any, res: Response): Response<any, Record<string, any>> {
    if (type == "catchError" && error instanceof Error) {
        return res.status(500).json({ message: error.message })
    } if (type == "validationError") {
        const errors = error.error.details.map((error: any) => error.message)
        return res.status(400).json({ message: "Validation Errors.", errors })
    }
    return res;
}