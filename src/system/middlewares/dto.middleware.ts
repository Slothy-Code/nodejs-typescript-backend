import * as express from 'express';
import {validate, ValidationError} from 'class-validator';
import {plainToClass} from 'class-transformer';
import {HttpException} from '../exceptions/http-exception';

export function DTOMiddleware(type: { new() }, skipMissingProperties): express.RequestHandler {
    return async (req, res, next) => {
        const errors = await validate(plainToClass(type, req.body), {skipMissingProperties});
        if (errors.length > 0) {
            const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
            next(new HttpException(400, message));
        } else {
            next();
        }
    }
}