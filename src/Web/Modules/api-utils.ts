import { Response } from "express";

export function sendError(res: Response, json: { 
    code?: number, 
    message?: string 
}) {
    if (!json.code) json.code = 400;
    if (!json.message) json.message = "An unknown error occurred.";
    res.status(400).json({ 
        code: json.code,
        message: json.message
    });
};