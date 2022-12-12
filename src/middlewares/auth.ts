import { RequestHandler } from "express";
import { decodeToken } from "../jwt";

export const isAuthed: RequestHandler = (request, _response, next) => {
    const authToken = request.header('Authorization')!;
    if (!authToken) {
        return next(new Error('Authorization is required for this operation'));
    }

    const jwtToken = authToken.replace('Bearer ', '');
    const user = decodeToken(jwtToken);
    (request as any).user = user;
    next();
};
