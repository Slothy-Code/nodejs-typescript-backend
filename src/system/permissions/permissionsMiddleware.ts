import * as passport from 'passport';

export class PermissionsMiddleware {

    public static hasPermission(permission: string) {
        return (req, res, next) => {
            passport.authenticate('bearer', {session: false}, async (err, user, info) => {
                if (!user.token) {
                    res.status(403).json({message: 'Forbidden'});
                    return;
                }

                if (user) {
                    if (user.hasPermission(permission)) {
                        req.user = user;
                        next();
                    } else res.status(402).json({message: 'Forbidden'});
                }
                else res.status(403).json({message: 'Forbidden'});
            })(req, res, next);
        }
    }
}
