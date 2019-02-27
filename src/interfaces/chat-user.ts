import {Response} from 'express';
import {User} from '../schemas/user';

export interface ChatUser {
    user: User;
    connection: Response;
}