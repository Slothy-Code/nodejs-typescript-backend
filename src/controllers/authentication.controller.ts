import {Request, Response} from 'express';
import {Controller} from '../system/decorators/controller';
import {Route} from '../system/decorators/route';
import {User} from '../interfaces/schemas/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

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

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) throw 'Invalid name and/or password';

            const token = this.generateToken(user);

            return res.status(200).json({token: token});
        } catch (error) {
            console.log(error);
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

            let newUser = await new User(req.body).save();

            res.status(200).json(newUser);
        } catch (err) {
            res.status(400).json(err)
        }
    }

    @Route({route: '/refresh-token', type: 'get', permission: 'user.refreshToken'})
    public async refreshToken(req: Request, res: Response) {
        const user = req.user;

        const token = this.generateToken(user);
        return res.status(200).json({token: token});
    }

    @Route({route: '/permissions', permission: 'user.getPermissions'})
    public async getPermissions(req: Request, res: Response) {
        res.status(200).json(req.user.getPermissions());
    }

    private generateToken(user: any) {
        let token = jwt.sign({
            name: user.name,
            _id: user._id
        }, process.env.SESSION_SECRET, {expiresIn: '3h'});
        return token;
    }

}
