import * as passport from 'passport';
import {HttpException} from '../exceptions/http-exception';

export function permissionMiddleware(permission: string) {
    return (req, res, next) => {
        passport.authenticate('jwt', {session: false}, (err, user, info) => {
            if (!user) {
                if (info.name === 'TokenExpiredError') {
                    return next(new HttpException(401, 'Your token has expired.'));
                } else {
                    return next(new HttpException(401, info.message));
                }
            }

            if (user.hasPermission(permission)) {
                req.user = user;
                return next();
            } else {
                return next(new HttpException(401, 'You have no permission to do that'));
            }
        })(req, res, next);
    }
}