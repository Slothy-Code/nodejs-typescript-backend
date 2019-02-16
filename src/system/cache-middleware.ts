const cache = require('memory-cache');
import {NextFunction, Request} from 'express';

export class CacheMiddleware {

    public static cacheMiddleware(req: Request, res: any, next: NextFunction) {
        let key = req.originalUrl || req.url
        let cacheContent = cache.get(key);
        if (cacheContent) {
            res.send(cacheContent);
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                cache.put(key, body, Number(process.env.CACHE_DURATION));
                res.sendResponse(body)
            }
            next()
        }
    }
}



