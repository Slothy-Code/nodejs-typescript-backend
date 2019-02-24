import {HttpException} from '../exceptions/http-exception';
import {NextFunction, Request, Response} from 'express';


export function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction
) {
    let message = error.message || 'Something went wrong';
    const status = error.status || 500;

    if (process.env.PROD === 'true' && status === 500) {
        message = 'Something went wrong';
    }
    response.status(status).json({status, message});
}
