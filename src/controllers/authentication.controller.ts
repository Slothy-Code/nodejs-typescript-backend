import {NextFunction, Request, Response} from 'express';
import {Controller} from '../system/decorators/controller';
import {Route} from '../system/decorators/route';
import {User} from '../schemas/user';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import {DTOValidate} from '../system/decorators/dto-validate';
import {HttpException} from '../system/exceptions/http-exception';
import {UserLoginDto} from '../DTO/user-login.dto';
import {UserRegisterDto} from '../DTO/user-register.dto';

@Controller('/user')
export class AuthenticationController {

    @DTOValidate(UserLoginDto)
    @Route({route: '/login', type: 'post'})
    public async login(req: Request, res: Response, next: NextFunction) {
        const name = req.body.name;
        const password = req.body.password;

        let user = await User.findOne({'name': name}).select('+password').exec();
        if (user === null) return next(new HttpException(401, 'Invalid name and/or password'));

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) return next(new HttpException(401, 'Invalid name and/or password'));

        const token = this.generateToken(user);

        return res.status(200).json({token: token});
    }

    @DTOValidate(UserRegisterDto)
    @Route({route: '/register', type: 'post'})
    public async register(req: Request, res: Response, next: NextFunction) {
        let name = req.body.name;

        let user = await User.findOne({name: name});
        if (user !== null) return next(new HttpException(409, 'User already exists'));

        let newUser = await new User(req.body).save();

        res.status(200).json(newUser);
    }

    @Route({route: '/refresh-token', type: 'get', permission: 'user.refreshToken'})
    public async refreshToken(req: Request, res: Response) {
        const user = req.user;

        const token = this.generateToken(user);
        return res.status(200).json({token: token});
    }

    @Route({route: '/permissions', permission: 'user.getPermissions'})
    public async getPermissions(req: Request, res: Response) {
        res.status(200).json({permissions: req.user.getPermissions()});
    }

    private generateToken(user: User) {
        let token = jwt.sign({
            name: user.name,
            role: user.role,
            _id: user._id
        }, process.env.SESSION_SECRET, {expiresIn: process.env.TOKEN_EXPIRATION_TIME});
        return token;
    }

}
