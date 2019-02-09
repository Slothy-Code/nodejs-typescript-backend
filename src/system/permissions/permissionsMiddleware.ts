import * as passport from 'passport';
import {User} from '../../interfaces/schemas/User';

export class PermissionsMiddleware {

    public static hasPermission(permission: string) {
        return (req, res, next) => {
            passport.authenticate('jwt', {session: false}, async (err, dummyUser, info) => {
                const user = await User.findById(dummyUser._id);

                if (!user) {
                    res.status(403).json({message: 'Forbidden'});
                    return;
                }

                if (user.hasPermission(permission)) {
                    req.user = user;
                    next();
                } else res.status(402).json({message: 'Forbidden'});
            })(req, res, next);
        }
    }
}
