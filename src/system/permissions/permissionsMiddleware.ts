import * as passport from 'passport';

export class PermissionsMiddleware {
    public static hasPermission(permission: string) {
        return (req, res, next) => {
            passport.authenticate('jwt', {session: false}, async (err, user, info) => {
                if (!user) {
                    res.status(401).json({message: 'Forbidden'});
                    return;
                }

                if (user.hasPermission(permission)) {
                    req.user = user;
                    next();
                } else res.status(401).json({message: 'Forbidden'});
            })(req, res, next);
        }
    }
}
