import {NextFunction, Request, Response} from 'express';
import {Controller} from '../system/decorators/controller';
import {Route} from '../system/decorators/route';
import {User} from '../interfaces/schemas/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jwt-simple';

@Controller('/user')
export class AuthenticationController {

    @Route({route: '/login', type: 'post'})
    public async login(req: Request, res: Response) {
        try {
            const name = req.body.name;
            const password = req.body.password;

            if (!name || !password || password.length < 3 || name.length < 3) throw 'Invalid name and/or password';

            let user = await User.findOne({'name': name}).select('+password').exec();
            if (user === null) throw 'Invalid name and/or password';

            user.token = this.generateToken(user);
            user.save();

            let success = await bcrypt.compare(password, user.password);
            if (!success) throw 'Invalid name and/or password';

            return res.status(200).json(user.token);
        } catch (error) {
            res.status(401).json({'message': 'Invalid credentials', 'errors': error})
        }
    }

    @Route({route: '/register', type: 'post'})
    public async register(req: Request, res: Response) {
        try {
            let name = req.body.name;
            let password = req.body.password;

            if (!name || name.length < 6) throw 'Your name is too short';
            if (!password || password.length < 6) throw 'Your password is too short';

            let user = await User.findOne({name: name});
            if (user !== null) throw 'User with this name already exists';

            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(password, salt);

            let newUser = await new User({name: name, password: hash}).save();

            res.status(200).json(newUser);
        } catch (err) {
            res.status(400).json(err)
        }
    }

    @Route({route: '/refresh-token', type: 'get'})
    public async refreshToken(req: Request, res: Response) {
        try {
            if (!req.headers.authorization) throw 'Not logged!';
            let token = req.headers.authorization.substring(7);

            let user = await User.findOne({token: token});

            if (user === null) throw 'Invalid token';

            user.token = this.generateToken(user);
            user.save();
            return res.status(200).json(user.token);
        } catch (error) {
            res.status(500).json({'message': error})
        }
    }

    private generateToken(user: any) {
        let token = jwt.encode({
            name: user.name,
            user: user._id
        }, process.env.SESSION_SECRET);
        return token;
    }


}
